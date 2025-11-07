import uuid
import hashlib
from datetime import date
from flask import Flask, request, jsonify  # pyright: ignore[reportMissingImports]
from flask_cors import CORS  # pyright: ignore[reportMissingModuleSource]
from db import get_db_connection

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost", "http://127.0.0.1"]}})

# Utilities
def generate_uuid():
    return str(uuid.uuid4())

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def db_query(query, params=None, fetch=None, dict=False):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=dict)
    cursor.execute(query, params or ())

    if fetch == "one":
        result = cursor.fetchone()
    elif fetch == "all":
        result = cursor.fetchall()
    else:
        result = None

    conn.commit()
    conn.close()
    return result

def log_action(user_id, action):
    db_query(
        "INSERT INTO activity_logs (id, user_id, action) VALUES (%s, %s, %s)",
        (generate_uuid(), user_id, action)
    )

# AUTH
@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = db_query(
        "SELECT * FROM users WHERE username = %s",
        (username,),
        fetch="one",
        dict=True
    )

    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    if user["password"] != hash_password(password):
        return jsonify({"status": "error", "message": "Invalid password"}), 401

    if user["status"] != "approved":
        return jsonify({"status": "error", "message": "Account pending approval"}), 403

    return jsonify({
        "status": "success",
        "message": "Login successful",
        "user_id": user["id"],
        "role": user["role"],
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "middle_initial": user["middle_initial"],
    })

# REGISTRATION
@app.route('/api/register', methods=['POST'])
def register_resident():
    data = request.get_json()

    required = ["first_name", "last_name", "gender", "birthdate", "username", "password"]
    if any(not data.get(field) for field in required):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    exists = db_query(
        "SELECT id FROM users WHERE username = %s",
        (data["username"],),
        fetch="one"
    )

    if exists:
        return jsonify({"status": "error", "message": "Username already taken."}), 409

    user_id = generate_uuid()
    resident_id = generate_uuid()

    db_query(
        """
        INSERT INTO users (id, role, username, password, first_name, last_name, middle_initial, status)
        VALUES (%s, 'resident', %s, %s, %s, %s, %s, 'pending')
        """,
        (
            user_id,
            data["username"],
            hash_password(data["password"]),
            data["first_name"],
            data["last_name"],
            data.get("middle_initial", "")
        )
    )

    db_query(
        """
        INSERT INTO residents (id, first_name, last_name, middle_initial, gender, birthdate, address, contact_number, user_id)
        VALUES (%s, %s, %s, %s, %s, %s, 'Casambalangan, Santa Ana, Cagayan', %s, %s)
        """,
        (
            resident_id,
            data["first_name"],
            data["last_name"],
            data.get("middle_initial", ""),
            data["gender"],
            data["birthdate"],
            data.get("contact_number", ""),
            user_id
        )
    )

    log_action(user_id, f"New resident registered: {data['first_name']} {data['last_name']}")

    return jsonify({"status": "success", "message": "Registration successful! Pending approval."})

@app.route('/api/register-staff', methods=['POST'])
def register_staff():
    try:
        data = request.get_json()
        required = ["first_name", "last_name", "username", "password"]
        if any(not data.get(field) for field in required):
            return jsonify({"status": "error", "message": "Missing required fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM users WHERE username = %s", (data["username"],))
        if cursor.fetchone():
            return jsonify({"status": "error", "message": "Username already taken."}), 409

        user_id = str(uuid.uuid4())
        hashed_pw = hashlib.sha256(data["password"].encode()).hexdigest()

        cursor.execute("""
            INSERT INTO users (id, role, username, password, first_name, last_name, middle_initial, status)
            VALUES (%s, 'staff', %s, %s, %s, %s, %s, 'approved')
        """, (
            user_id,
            data["username"],
            hashed_pw,
            data["first_name"],
            data["last_name"],
            data.get("middle_initial", "")
        ))
        conn.commit()
        cursor.close()
        conn.close()

        admin_id = request.headers.get("Admin-ID") or request.json.get("admin_id")
        log_action(admin_id, f"Added new staff: {data['first_name']} {data['last_name']}")
        return jsonify({"status": "success", "message": "Staff added successfully."})

    except Exception as e:
        print("Error in register_staff:", e)
        return jsonify({"status": "error", "message": str(e)}), 500

# ADMIN — Approve User
@app.route('/api/users/<user_id>/approve', methods=['PUT'])
def approve_user(user_id):
    db_query("UPDATE users SET status='approved' WHERE id=%s", (user_id,))
    admin_id = request.headers.get("Admin-ID") or request.json.get("admin_id")
    log_action(admin_id, f"Approved user {user_id}")
    return jsonify({"status": "success"})

# ADMIN — Decline User
@app.route('/api/users/<user_id>/decline', methods=['PUT'])
def decline_user(user_id):
    db_query("DELETE FROM users WHERE id=%s", (user_id,))
    admin_id = request.headers.get("Admin-ID") or request.json.get("admin_id")
    log_action(admin_id, f"Declined user {user_id}")
    return jsonify({"status": "success"})

# ADMIN — Delete User
@app.route('/api/users/<user_id>/delete', methods=['PUT'])
def delete_user(user_id):
    try:
        admin_id = request.headers.get("Admin-ID") or request.json.get("admin_id")
        log_action(admin_id, f"Deleted user {user_id}")

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"status": "success", "message": "User deleted successfully"})

    except Exception as e:
        print("Error deleting user:", e)
        return jsonify({"status": "error", "message": str(e)}), 500

# ADMIN — Stats
@app.route('/api/admin/stats', methods=['GET'])
def admin_stats():
    total_residents = db_query("SELECT COUNT(*) AS total FROM residents", fetch="one", dict=True)["total"]
    pending_requests = db_query("SELECT COUNT(*) AS total FROM clearance_requests WHERE status='pending'", fetch="one", dict=True)["total"]
    approved_requests = db_query("SELECT COUNT(*) AS total FROM clearance_requests WHERE status='approved'", fetch="one", dict=True)["total"]
    staff_count = db_query("SELECT COUNT(*) AS total FROM users WHERE role IN ('staff')", fetch="one", dict=True)["total"]

    issued_certificates = db_query(
        "SELECT COUNT(*) AS total FROM clearance_requests WHERE status='approved' AND issued_date IS NOT NULL",
        fetch="one", dict=True
    )["total"]

    return jsonify({
        "total_residents": total_residents,
        "pending_requests": pending_requests,
        "approved_requests": approved_requests,
        "staff_count": staff_count,
        "issued_certificates": issued_certificates  
    })

# ADMIN — List Pending Users
@app.route('/api/pending-users', methods=['GET'])
def pending_users():
    users = db_query("""
        SELECT id, first_name, last_name, middle_initial, username, role, created_at
        FROM users
        WHERE status='pending'
        ORDER BY created_at DESC
    """, fetch="all", dict=True)
    return jsonify(users)

# ADMIN — List Approved Users
@app.route('/api/approved-users', methods=['GET'])
def approved_users():
    users = db_query("""
        SELECT id, first_name, last_name, middle_initial, username, role, created_at
        FROM users
        WHERE status='approved' AND role != 'admin'
        ORDER BY created_at DESC
    """, fetch="all", dict=True)
    return jsonify(users)

# ADMIN - APPROVE CLEARANCE
@app.route('/api/clearances/approve/<clearance_id>', methods=['PUT'])
def approve_clearance(clearance_id):

    count = db_query(
        "SELECT COUNT(*) AS total FROM clearance_requests WHERE YEAR(created_at)=YEAR(CURDATE())",
        fetch="one",
        dict=True
    )["total"] + 1

    control_number = f"BC-{date.today().year}-{count:04d}"

    db_query(
        """
        UPDATE clearance_requests
        SET status='approved', issued_date=CURDATE(), control_number=%s
        WHERE id=%s
        """,
        (control_number, clearance_id)
    )
    admin_id = request.headers.get("Admin-ID") or request.json.get("admin_id")
    log_action(admin_id, f"Approved clearance {clearance_id} ({control_number})")

    return jsonify({"status": "success", "control_number": control_number})

# STAFF — Verify Clearance
@app.route('/api/staff/verify/<clearance_id>', methods=['PUT'])
def staff_verify(clearance_id):
    staff_id = request.headers.get("Staff-ID")
    updated = db_query(
        "UPDATE clearance_requests SET status='verified' WHERE id=%s AND status='pending'",
        (clearance_id,)
    )

    log_action(staff_id, f"Verified clearance {clearance_id}")

    return jsonify({"status": "success", "message": "Verified!"})

# STAFF — Release Clearance
@app.route('/api/staff/release/<clearance_id>', methods=['PUT'])
def staff_release(clearance_id):
    db_query(
        """
        UPDATE clearance_requests SET released_date=CURDATE()
        WHERE id=%s AND status='approved'
        """,
        (clearance_id,)
    )
    staff_id = request.headers.get("Staff-ID") or "staff"
    log_action(staff_id, f"Released clearance {clearance_id}")

    return jsonify({"status": "success"})

# STAFF — Stats
@app.route('/api/staff/stats', methods=['GET'])
def staff_stats():
    to_verify = db_query("SELECT COUNT(*) AS total FROM clearance_requests WHERE status='pending'", fetch="one", dict=True)["total"]
    ready_to_print = db_query("SELECT COUNT(*) AS total FROM clearance_requests WHERE status='approved' AND released_date IS NULL", fetch="one", dict=True)["total"]
    released_today = db_query("SELECT COUNT(*) AS total FROM clearance_requests WHERE released_date=CURDATE()", fetch="one", dict=True)["total"]

    return jsonify({
        "to_verify": to_verify,
        "ready_to_print": ready_to_print,
        "released_today": released_today
    })

# CLEARANCE REQUEST (for registered users)
@app.route('/api/clearances', methods=['POST'])
def request_clearance():
    data = request.get_json()
    user_id = data.get("user_id")
    purpose = data.get("purpose")

    if not user_id or not purpose:
        return jsonify({"status": "error", "message": "Missing fields"}), 400

    clearance_id = generate_uuid()

    db_query(
        """
        INSERT INTO clearance_requests (id, user_id, resident_id, purpose, status)
        VALUES (%s, %s, %s, %s, 'pending')
        """,
        (clearance_id, user_id, None, purpose)  # user_id set, resident_id NULL
    )

    log_action(user_id, f"Requested clearance: {purpose}")

    return jsonify({"status": "success"})

# STAFF — Walk-in Clearance Request
@app.route('/api/staff/walk-in', methods=['POST'])
def walk_in():
    data = request.get_json()
    name = data.get("name")
    purpose = data.get("purpose")
    gender = data.get("gender")
    birthdate = data.get("birthdate")
    address = data.get("address")
    contact_number = data.get("contact_number")

    if not name or not purpose:
        return jsonify({"status": "error", "message": "Missing required fields (name, purpose)"}), 400

    parts = name.split(" ", 1)
    first_name = parts[0]
    last_name = parts[1] if len(parts) > 1 else ""

    resident = db_query(
        "SELECT id FROM residents WHERE first_name=%s AND last_name=%s",
        (first_name, last_name),
        fetch="one",
        dict=True
    )

    if resident:
        resident_id = resident["id"]
    else:
        resident_id = generate_uuid()
        db_query(
            """
            INSERT INTO residents
            (id, first_name, last_name, middle_initial, gender, birthdate, address, contact_number, user_id, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, 'Casambalangan, Santa Ana, Cagayan', %s, %s, NOW())
            """,
            (resident_id, first_name, last_name, "", gender, birthdate, contact_number, None)
        )

    clearance_id = generate_uuid()
    db_query(
        """
        INSERT INTO clearance_requests (id, user_id, resident_id, purpose, status)
        VALUES (%s, %s, %s, %s, 'pending')
        """,
        (clearance_id, None, resident_id, purpose)
    )

    staff_id = request.headers.get("Staff-ID") or "staff"
    log_action(staff_id, f"Walk-in clearance request: {name}")

    return jsonify({"status": "success", "message": "Walk-in request encoded!"})

# GET — List All Clearances
@app.route('/api/clearances', methods=['GET'])
def list_clearances():
    clearances = db_query("""
        SELECT cr.id, 
               COALESCE(u.first_name, r.first_name) AS first_name, 
               COALESCE(u.last_name, r.last_name) AS last_name, 
               cr.purpose, cr.status, cr.issued_date, cr.control_number, cr.created_at, cr.released_date
        FROM clearance_requests cr
        LEFT JOIN users u ON cr.user_id = u.id
        LEFT JOIN residents r ON cr.resident_id = r.id
        ORDER BY cr.created_at DESC
    """, fetch="all", dict=True)
    return jsonify(clearances)

# CLEARANCE HISTORY FOR USER
@app.route('/api/clearances/user/<user_id>', methods=['GET'])
def get_user_clearances(user_id):
    clearances = db_query(
        """
        SELECT id, purpose, status, control_number, created_at
        FROM clearance_requests
        WHERE user_id=%s
        ORDER BY created_at DESC
        """,
        (user_id,),
        fetch="all",
        dict=True
    )
    return jsonify(clearances)

# STAFF — List Pending Verification
@app.route('/api/staff/for-verification', methods=['GET'])
def staff_for_verification():
    requests = db_query("""
        SELECT cr.id, 
               COALESCE(u.first_name, r.first_name) AS first_name, 
               COALESCE(u.last_name, r.last_name) AS last_name, 
               cr.purpose, cr.status, cr.created_at
        FROM clearance_requests cr
        LEFT JOIN users u ON cr.user_id = u.id
        LEFT JOIN residents r ON cr.resident_id = r.id
        WHERE cr.status='pending'
        ORDER BY cr.created_at DESC
    """, fetch="all", dict=True)
    return jsonify(requests)

# STAFF — List Approved (For Release)
@app.route('/api/staff/for-release', methods=['GET'])
def staff_for_release():
    requests = db_query("""
        SELECT cr.id, 
               COALESCE(u.first_name, r.first_name) AS first_name, 
               COALESCE(u.last_name, r.last_name) AS last_name,
               COALESCE(u.middle_initial, r.middle_initial, '') AS middle_initial,
               cr.purpose, 
               cr.control_number, 
               cr.status, 
               cr.created_at,
               cr.issued_date,
               CASE 
                   WHEN cr.user_id IS NOT NULL THEN 'Registered'
                   ELSE 'Walk-In'
               END AS request_type
        FROM clearance_requests cr
        LEFT JOIN users u ON cr.user_id = u.id
        LEFT JOIN residents r ON cr.resident_id = r.id
        WHERE cr.status='approved' AND cr.released_date IS NULL
        ORDER BY cr.created_at DESC
    """, fetch="all", dict=True)
    return jsonify(requests)

# PRINT CLEARANCE
@app.route('/api/clearances/print/<clearance_id>', methods=['GET'])
def print_clearance(clearance_id):
    record = db_query(
        """
        SELECT cr.*, 
               COALESCE(u.first_name, r.first_name) AS first_name, 
               COALESCE(u.last_name, r.last_name) AS last_name, 
               COALESCE(u.address, r.address) AS address
        FROM clearance_requests cr
        LEFT JOIN users u ON cr.user_id = u.id
        LEFT JOIN residents r ON cr.resident_id = r.id
        WHERE cr.id=%s
        """,
        (clearance_id,),
        fetch="one",
        dict=True
    )

    if not record:
        return jsonify({"status": "error", "message": "Not found"}), 404

    return jsonify(record)

# START SERVER
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
