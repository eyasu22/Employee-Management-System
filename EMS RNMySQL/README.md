# Employee Management System (EMS)

## 📌 Project Overview

The **Employee Management System (EMS)** is a full-stack web application built using the **MERN stack (MYSQL, Express.js, React.js, Node.js)** with MySQL for backend data storage. This system allows administrators to manage employee records efficiently.

## 🚀 Features

- **User Authentication:** Secure login and registration system.
- **Employee CRUD Operations:** Create, Read, Update, and Delete employee details.
- **Leave Management:** Apply and approve leave requests.
- **Calendar Integration:** View work schedules and holidays.
- **Responsive Design:** Optimized for both desktop and mobile use.

## 🛠️ Tech Stack

### **Frontend:**

- React.js
- Vite
- React Router
- Axios
- Tailwind CSS (or Bootstrap)

### **Backend:**

- Node.js
- Express.js
- MySQL (Database)
- Sequelize (ORM)
- JWT Authentication

## 📂 Project Structure

```
EMS/
│-- Front-End/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── EmployeeList.jsx
│   │   │   ├── EmployeeForm.jsx
│   │   │   ├── EmployeeCalendar.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   ├── App.js
│   │   ├── index.js
│-- Back-End/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   ├── server.js
│-- README.md
```

## 🏗️ Installation & Setup

### 1️⃣ **Clone the Repository**

```sh
git clone https://github.com/yourusername/EMS.git
cd EMS
```

### 2️⃣ **Backend Setup**

```sh
cd Back-End
npm install
node server.js
```

### 3️⃣ **Frontend Setup**

```sh
cd ../Front-End
npm install
npm run dev
```

## ⚡ Usage

1. Run the backend server (`node server.js`).
2. Run the frontend (`npm run dev`).
3. Open **http://localhost:5173/** in your browser.

## 🛠️ Troubleshooting

- If you encounter a **port conflict**, change the port in `vite.config.js` or `server.js`.
- Make sure **MySQL is running** and configured correctly in the `config/db.js` file.

## 📝 License

This project is **MIT Licensed**.

## 🤝 Contributing

Pull requests are welcome! Feel free to contribute to improving the system.

---

### ✨ **Developed by Eyasu Degefe Lombebo**
