import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div style={layoutStyle}>
      {/* Header & Navbar Area */}
      <header>
        <Navbar />
      </header>

      {/* Main Content Area */}
      <main style={mainStyle}>
        {children}
      </main>

      {/* Footer Area */}
      <footer style={footerStyle}>
        <p>&copy; {new Date().getFullYear()} Resourcia. All rights reserved.</p>
        <small>Organization Resource Management System</small>
      </footer>
    </div>
  );
}

const layoutStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

const mainStyle = {
  flex: 1,
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
};

const footerStyle = {
  textAlign: 'center',
  padding: '20px',
  background: '#f4f4f4',
  borderTop: '1px solid #ddd',
};