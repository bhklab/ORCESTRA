import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * Dark code snippet card with a header (title, copy button, language/method label).
 *
 * - Pass `href` to render a GET request: shows `curl "<href>"`, where only the URL is a link.
 * - Pass `code` (and optionally `label`, e.g. "R") to render a multi-line code snippet.
 */
const CodeBlock = ({ title, href, code, label }) => {
    const [copied, setCopied] = useState(false);
    const isRequest = Boolean(href);
    const copyText = isRequest ? `curl "${href}"` : code;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(copyText);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="flex flex-col bg-gray-900 rounded-lg overflow-hidden text-bodyXs font-mono">
            <div className="px-3 py-1.5 bg-gray-800 text-gray-300 font-semibold flex justify-between items-center gap-3">
                <span>{title}</span>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className={`flex items-center gap-1 transition-colors ${
                            copied ? 'text-green-400' : 'text-gray-400 hover:text-white'
                        }`}
                        aria-label="Copy code to clipboard"
                    >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    {isRequest ? (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 cursor-pointer hover:text-lightYellow hover:underline transition-colors"
                        >
                            GET
                        </a>
                    ) : (
                        label && <span className="text-gray-400">{label}</span>
                    )}
                </div>
            </div>
            <div className="p-3 text-gray-100 overflow-x-auto">
                {isRequest ? (
                    <code className="whitespace-nowrap">
                        curl &quot;
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-pointer hover:text-lightYellow hover:underline transition-colors"
                        >
                            {href}
                        </a>
                        &quot;
                    </code>
                ) : (
                    <pre>
                        <code>{code}</code>
                    </pre>
                )}
            </div>
        </div>
    );
};

export default CodeBlock;
