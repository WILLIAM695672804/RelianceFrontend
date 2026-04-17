import React from 'react';

interface Props {
    files: File[];
    onRemove: (index: number) => void;
}

const FilePreview: React.FC<Props> = ({ files, onRemove }) => {
    if (files.length === 0) return null;

    return (
        <div className="chat-file-preview">
            {files.map((file, index) => (
                <div key={index} className="chat-file-preview-item">
                    {file.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(file)} alt={file.name} className="chat-file-thumb" />
                    ) : (
                        <div className="chat-file-icon">
                            <span className="material-symbols-outlined">
                                {file.type.startsWith('video/') ? 'movie' : 'description'}
                            </span>
                        </div>
                    )}
                    <span className="chat-file-name">{file.name}</span>
                    <button className="chat-file-remove" onClick={() => onRemove(index)} type="button">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FilePreview;
