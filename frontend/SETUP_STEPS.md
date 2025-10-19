# Frontend Setup Guide 🚀

Step-by-step guide to set up React + TypeScript in this folder.

---

## 📋 Step 1: Initialize the Project

Run these commands from the `frontend` folder:

```bash
# Initialize package.json
npm init -y

# Install React and ReactDOM
npm install react react-dom

# Install TypeScript and types
npm install -D typescript @types/react @types/react-dom

# Install Vite (build tool)
npm install -D vite @vitejs/plugin-react

# Install TailwindCSS for styling
npm install -D tailwindcss postcss autoprefixer

# Install Lucide React for icons
npm install lucide-react

# Install Axios for API calls
npm install axios
```

---

## 📋 Step 2: Create Configuration Files

I'll create these for you, or you can create them manually:

### `vite.config.ts`
### `tsconfig.json`
### `tsconfig.node.json`
### `tailwind.config.js`
### `postcss.config.js`
### `index.html`

---

## 📋 Step 3: Create Folder Structure

```bash
# Inside frontend folder, create this structure:
mkdir -p src/features/chat
mkdir -p src/features/news
mkdir -p src/features/voice
mkdir -p src/components
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/context
mkdir -p public
```

---

## 📋 Step 4: Create Core Files

### Main Files:
- `src/main.tsx` - Entry point
- `src/App.tsx` - Root component
- `src/index.css` - Global styles

### Feature Files (example for chat):
- `src/features/chat/ChatPage.tsx`
- `src/features/chat/ChatMessage.tsx`
- `src/features/chat/ChatInput.tsx`
- `src/features/chat/useChat.ts`

---

## 📋 Step 5: Add Scripts to package.json

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

---

## 📋 Step 6: Run the Dev Server

```bash
npm run dev
```

Open http://localhost:5173

---

Would you like me to:
1. Create all these files for you automatically?
2. Guide you to create them one by one?
3. Show you the full folder structure first?

