# 💰 MintMate - Smart Budget Tracking App

A modern fintech application designed for college students in India to manage their monthly budget, track expenses, and achieve savings goals.

![MintMate Logo](https://img.shields.io/badge/MintMate-Budget_Tracker-3dd683?style=for-the-badge)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://mintmate-mu.vercel.app)

## 🌐 Live Demo

**🚀 [Try MintMate Live on Vercel](https://mintmate-mu.vercel.app)**

> ⚠️ **Note**: This is a prototype. All data is stored locally in your browser and is not persisted across sessions.

## ✨ Features

### 📊 Core Features
- **Safe-to-Spend Calculator** - Know exactly how much you can spend today based on remaining days, bills, and goals
- **Quick Expense Entry** - Log expenses in under 10 seconds with smart category selection
- **Bills & Reminders** - Never miss a recharge or subscription payment
- **Savings Goals** - Track progress towards laptops, trips, or emergency funds
- **Insights & Analytics** - Visualize spending patterns with beautiful charts
- **Flatmate Splits** - Share costs and settle up easily

### 🎨 Design
- Clean, modern UI with Tailwind CSS v4
- Responsive design (mobile-first)
- Dark mode support
- Beautiful animations and transitions
- Accessible (WCAG compliant)

### 🌐 Localization
- English and Hindi support
- ₹ (Rupee) and UPI-first design
- Built for Indian college students

## 🚀 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Phosphor Icons
- **State Management**: React Context + Hooks

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/shhrey07/mintmate-fintech-app.git

# Navigate to project directory
cd mintmate-fintech-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🛠️ Available Scripts

```bash
npm run dev        # Start development server (port 8443)
npm run build      # Build for production
npm run preview    # Preview production build
npm run format     # Format code with oxfmt
```

## 🎯 Project Structure

```
src/
├── App.tsx              # Main app component with routing
├── site.tsx             # Landing page
├── auth.tsx             # Authentication flow
├── welcome.tsx          # Onboarding screens
├── home.tsx             # Dashboard
├── addExpense.tsx       # Quick expense entry
├── lists.tsx            # Bills, Goals, Transactions
├── analysis.tsx         # Insights, History, Splits
├── aiAssistant.tsx      # AI budget assistant
├── settings.tsx         # App settings
├── store.tsx            # Global state management
├── ui.tsx               # Reusable UI components
└── components/ui/       # Additional UI components
```

## 🌟 Key Improvements

- ✅ Fixed missing React imports (`useEffect`)
- ✅ Fixed missing component imports (`Welcome`, `Auth`)
- ✅ Updated TypeScript config (removed deprecated `baseUrl`)
- ✅ Fixed Vite config warnings (JSON import attributes, `import.meta.dirname`)
- ✅ Custom hands-with-dollar logo integrated
- ✅ Production-ready build

## 📱 Preview

### 🌐 Try it Live!
**[Launch MintMate App →](https://mintmate-mu.vercel.app)**

The app includes:
- Landing page with feature showcase
- User authentication (sign up/sign in)
- Welcome/onboarding flow
- Main dashboard with budget overview
- Expense tracking interface
- Analytics and insights
- Settings panel

### 📸 Screenshots
<h2 align="center">Screenshots</h2>

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/a9ff6e18-1b5a-4071-9efc-3fdbd094ea71" width="450" alt="Screenshot 1"></td>
    <td><img src="https://github.com/user-attachments/assets/dced1b8e-0eb9-42da-9a05-fa351065ebef" width="450" alt="Screenshot 2"></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/5cd2b37a-5768-4506-a610-c694b73642bd" width="450" alt="Screenshot 3"></td>
    <td><img src="https://github.com/user-attachments/assets/98f2026a-7a29-4c85-92b0-0ddb6a82a54a" width="450" alt="Screenshot 4"></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/01a80126-03a9-4de9-b247-e33e659fc5c3" width="450" alt="Screenshot 5"></td>
    <td><img src="https://github.com/user-attachments/assets/5b737e28-148d-4928-a29d-b38c00c4ed64" width="450" alt="Screenshot 6"></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/0104b930-ddd3-418f-9126-15b897061b04" width="450" alt="Screenshot 7"></td>
  </tr>
</table>

## 🔒 Privacy

- No bank or UPI linking required
- Data stored locally in browser
- Privacy mode to hide amounts
- Export data anytime (CSV/JSON)

## 📄 License

This is a design prototype for educational purposes.

## 👨‍💻 Author

**shhrey07**
- GitHub: [@shhrey07](https://github.com/shhrey07)

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

---

Built with ❤️ using React, Vite, and Tailwind CSS
