import bridge from "@vkontakte/vk-bridge";
import { createRoot } from "react-dom/client";
import App from "./App";

// Init VK  Mini App
bridge.send("VKWebAppInit");

const root = createRoot(document.getElementById('root'));
import("./eruda").then(({ default: eruda }) => {}); //runtime download
root.render(<App />)
