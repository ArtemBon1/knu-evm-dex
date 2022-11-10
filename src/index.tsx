import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';
import { ConfigProvider, AdaptivityProvider, WebviewType, Platform } from '@vkontakte/vkui';
import "@vkontakte/vkui/dist/vkui.css";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const ConfigProviderFix: any = ConfigProvider;
const AdaptivityProviderFix: any = AdaptivityProvider;

root.render(
    <React.StrictMode>
        <ConfigProviderFix appearance={'dark'} webviewType={WebviewType.INTERNAL} platform={Platform.IOS}>
            <AdaptivityProviderFix>
                <App />
            </AdaptivityProviderFix>
        </ConfigProviderFix>
    </React.StrictMode>
);