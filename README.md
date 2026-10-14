# 💰 MintMate - Smart Budget Tracking App

A modern fintech application designed for college students in India to manage their monthly budget, track expenses, and achieve savings goals.

![MintMate Logo](https://img.shields.io/badge/MintMate-Budget_Tracker-3dd683?style=for-the-badge)

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

The app includes:
- Landing page with feature showcase
- User authentication (sign up/sign in)
- Welcome/onboarding flow
- Main dashboard with budget overview
- Expense tracking interface
- Analytics and insights
- Settings panel

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
