import * as React from "react";
import { chatBuffer } from "../controllers/InGameController";
import { GameSocket } from "../game/GameSocket";
import * as outputBackground from "../assets/images/ui_box_1.png";
import * as inputBackground from "../assets/images/ui_box_2.png";
import "./HudChat.css";

export const MAX_LENGTH:number = 128;

export const HudChat = () => {
    const [history, setHistory] = React.useState([]);
    const [historyIndex, setHistoryIndex] = React.useState(0);
    const [inputText, setInputText] = React.useState("");
    const [outputText, setOutputText] = React.useState("");
    const textareaRef = React.useRef<HTMLTextAreaElement>();

    const onInputText = (evt:React.ChangeEvent<HTMLInputElement>) => {
        setInputText(evt.target.value);
    };

    const onKeyUp = (evt:React.KeyboardEvent) => {
        switch(evt.key){
            case "Enter":
                sendChat();
                break;

            case "ArrowUp":
                historyUp();
                break;

            case "ArrowDown":
                historyDown();
        }
    };

    const updateOutputText = (text:string) => {
        if(outputText){
            setOutputText(`${outputText}\n${text}`);
        }
        else{
            setOutputText(text);
        }

        scrollText();
    };

    const scrollText = () => {
        if(textareaRef.current){
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    };

    const sendChat = () => {
        const text:string = inputText.length > MAX_LENGTH ? inputText.substring(0, MAX_LENGTH) : inputText;
        GameSocket.chat(text);
        setInputText("");
        setHistory([text, ...history]);
        setHistoryIndex(-1);
    };

    const historyUp = () => {
        const index:number = historyIndex + 1;
        if(index < history.length){
            setHistoryIndex(index);
            setInputText(history[index]);
        }
    }

    const historyDown = () => {
        const index:number = historyIndex - 1;
        if(index >= 0){
            setHistoryIndex(index);
            setInputText(history[index]);
        }
    };

    React.useEffect(() => {
        chatBuffer.onData = updateOutputText;
        return () => {
            if(chatBuffer.onData === updateOutputText){
                chatBuffer.onData = null;
            }
        }
    });
    
    return (
        <div className="hud-chat-container hud-item">
            <div className="hud-chat-output-container">
                <textarea
                    readOnly
                    value={outputText}
                    ref={textareaRef}
                    style={{backgroundImage: `url(${outputBackground})`}}
                />
            </div>
            <div className="hud-chat-input-container">
                <input
                    type="text"
                    maxLength={MAX_LENGTH}
                    value={inputText}
                    onChange={onInputText}
                    onKeyUp={onKeyUp}
                    style={{backgroundImage: `url(${inputBackground})`}}
                />
            </div>
        </div>
    );
};