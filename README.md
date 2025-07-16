# Dynamic Interface Platform

A context-aware, progressive interface with dynamic affordances that intelligently narrows down what to show based on user intent.

## ✨ Features

- **Project Discovery & Search**: Browse existing projects by category, search by name/description, and clone templates
- **Context-Aware Suggestions**: The system analyzes user input and shows relevant suggestions
- **Progressive Interface**: Starts with a landing page, then transforms into a full workspace
- **Dynamic Affordances**: Only shows what's relevant to the user's current context
- **Smooth Animations**: Built with Framer Motion for delightful user experience
- **Modern Design**: Clean card-and-shadow style with modern spacing and fonts
- **Project Management**: Create, clone, and manage multiple projects with easy navigation

## 🎯 Design Principles

- **"Less, but better"**: Instead of offering a buffet of tools, the interface:
  - Starts from user intent (the initial prompt or chat)
  - Infers the most likely needs
  - Shows just 3–5 dynamic suggestions at a time
  - Updates those suggestions as context evolves

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd interface-exp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
interface-exp/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page with dynamic interface
├── components/
│   ├── InputBox.tsx         # Centered input with animations
│   ├── ChatAssistant.tsx    # AI assistant that slides in
│   ├── Canvas.tsx           # Main workspace area
│   └── SmartSuggestions.tsx # Context-aware suggestions
├── package.json
├── tailwind.config.js       # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎨 Visual Behavior

1. **On Load**: Beautiful InputBox interface with animated "Create in your way, Live in your way" title
2. **User Input**: 
   - User describes what they want to build
   - Intelligent suggestions and examples provided
   - Option to browse all projects
3. **After Input**: 
   - Shows "Create a New Project" section at the top
   - Displays similar existing projects at the bottom
   - Users can preview, clone, or create new
4. **On "Start Building"**: 
   - Input fades out
   - Assistant slides in from the right
   - Canvas fades in with light animation
   - Smart suggestions appear with slight delay at the bottom
5. **Everything feels responsive and modern**

## 🔧 Built With

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons

## 📱 Responsive Design

The interface is fully responsive and works on:
- Desktop (4-column grid layout)
- Tablet (2-column layout)
- Mobile (single column layout)

## 🎯 Context Detection

The system can detect various contexts from user input:

- **Medical/Healthcare**: tumor, medical, healthcare
- **E-commerce**: e-commerce, store, analytics, sales
- **Education**: class, course, graduation, credits
- **Data/Technical**: data, scientific, integration, sort
- **HR/Recruitment**: hiring, job, recruitment

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📄 License

This project is open source and available under the [MIT License](LICENSE). 