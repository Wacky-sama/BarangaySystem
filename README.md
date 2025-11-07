# Barangay Clearance & Residents Registry System

A simple web-based system to manage barangay residents, user registrations, and barangay clearance requests. Built with **XAMPP**, **Python (Flask)**, and **plain HTML/CSS/JS**.

---

## Features

- Resident registration with pending approval by admin
- Approve or decline resident accounts
- Manage barangay clearance requests
- Dashboard statistics for admins
- Activity logs for user actions
- List of approved residents (admins excluded)

---

## Tech Stack

- **Backend:** Python 3 + Flask  
- **Frontend:** HTML, CSS, JavaScript  
- **Database:** MySQL (via XAMPP)  
- **Server:** XAMPP (Apache + MySQL)  

---

## Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd BarangaySystem/backend
```

2. Create a virtual environment and activate it:

```bash
python3 -m venv venv # For Linux
source venv/bin/activate  # Linux
venv\Scripts\activate     # Windows
```

3. Install required packages:

```bash
pip install -r requirements.txt
```

4. Start the Flask backend:

```bash
python app.py
```

5. Open phpMyAdmin and create a database and name it **barangay_system**:
- Get the .sql file from [Database](/database/barangay_system.sql)
- After you're done creating the database, click it then click **Import**
- Find the .sql file then click **Import** below

---

## Default Accounts

| Role  | Username | Password   |
|-------|----------|------------|
| Admin | admin    | admin123   |
| Staff | staff01  | staff123   |

**Note:** Admin accounts cannot appear in the residents list for security.

---

## Usage

- Admins can approve/decline resident registrations and manage clearances.
- Staff can view statistics and manage assigned tasks.
- Residents can register and check their clearance status.

---

## License

This project is for educational purposes. Feel free to modify and use it.
