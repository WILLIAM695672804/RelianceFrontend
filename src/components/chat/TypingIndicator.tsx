import React from 'react';

interface Props {
    name: string;
}

const TypingIndicator: React.FC<Props> = ({ name }) => (
    <div className="chat-typing">
        <span className="chat-typing-name">{name}</span> est en train d'ecrire
        <span className="chat-typing-dots">
            <span>.</span><span>.</span><span>.</span>
        </span>
    </div>
);

export default TypingIndicator;
