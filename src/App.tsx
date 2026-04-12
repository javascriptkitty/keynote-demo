import Layout from "./components/Layout";
import ChatBot from "./components/ChatBot";
import Hero from "./components/Hero";
import "./App.css";

function App() {
  return (
    <>
      <Layout>
        <Hero />
      </Layout>
      <ChatBot />
    </>
  );
}

export default App;
