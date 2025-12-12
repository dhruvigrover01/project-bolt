import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Ethereum window type
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

// MetaMask icon component
const MetaMaskIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36.0112 3.33337L22.1207 13.6112L24.5997 7.56671L36.0112 3.33337Z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.98877 3.33337L17.7652 13.7049L15.4003 7.56671L3.98877 3.33337Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M31.0235 27.1265L27.4519 32.5765L35.2997 34.7333L37.5553 27.2549L31.0235 27.1265Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.45435 27.2549L4.70002 34.7333L12.5479 32.5765L8.97626 27.1265L2.45435 27.2549Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.1233 17.8514L9.94678 21.1578L17.7426 21.4962L17.4805 13.0654L12.1233 17.8514Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M27.8767 17.8514L22.4441 12.9719L22.1207 21.4962L29.9166 21.1578L27.8767 17.8514Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.5479 32.5765L17.2754 30.2891L13.1809 27.3091L12.5479 32.5765Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22.7246 30.2891L27.4519 32.5765L26.8191 27.3091L22.7246 30.2891Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M27.4519 32.5765L22.7246 30.2891L23.1015 33.1765L23.0563 34.6398L27.4519 32.5765Z" fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.5479 32.5765L16.9437 34.6398L16.9083 33.1765L17.2754 30.2891L12.5479 32.5765Z" fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.0234 25.5578L13.0649 24.3976L15.8996 23.1216L17.0234 25.5578Z" fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22.9766 25.5578L24.1004 23.1216L26.9451 24.3976L22.9766 25.5578Z" fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.5479 32.5765L13.2012 27.1265L8.97626 27.2549L12.5479 32.5765Z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M26.7988 27.1265L27.4519 32.5765L31.0235 27.2549L26.7988 27.1265Z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M29.9166 21.1578L22.1207 21.4962L22.9766 25.5578L24.1004 23.1216L26.9451 24.3976L29.9166 21.1578Z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.0649 24.3976L15.8996 23.1216L17.0234 25.5578L17.7426 21.4962L9.94678 21.1578L13.0649 24.3976Z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.94678 21.1578L13.1809 27.3091L13.0649 24.3976L9.94678 21.1578Z" fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M26.9451 24.3976L26.8191 27.3091L29.9166 21.1578L26.9451 24.3976Z" fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.7426 21.4962L17.0234 25.5578L17.9192 30.0058L18.1209 23.9418L17.7426 21.4962Z" fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22.1207 21.4962L21.7523 23.9319L21.9442 30.0058L22.9766 25.5578L22.1207 21.4962Z" fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22.9766 25.5578L21.9442 30.0058L22.7246 30.5338L26.8191 27.5538L26.9451 24.6423L22.9766 25.5578Z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.0649 24.6423L13.1809 27.5538L17.2754 30.5338L18.0558 30.0058L17.0234 25.5578L13.0649 24.6423Z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23.0563 34.6398L23.1015 33.1765L22.7545 32.8736H17.2455L16.9083 33.1765L16.9437 34.6398L12.5479 32.5765L14.0917 33.8551L17.1949 36H22.8051L25.9083 33.8551L27.4519 32.5765L23.0563 34.6398Z" fill="#C0AD9E" stroke="#C0AD9E" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22.7246 30.5338L21.9442 30.0058H18.0558L17.2754 30.5338L16.9083 33.1765L17.2455 32.8736H22.7545L23.1015 33.1765L22.7246 30.5338Z" fill="#161616" stroke="#161616" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M36.6843 14.1365L37.8333 8.56712L36.0112 3.33337L22.7246 13.2173L27.8767 17.5969L35.0911 19.6949L36.7449 17.7633L36.0112 17.2256L37.1502 16.1827L36.2445 15.4856L37.3833 14.6141L36.6843 14.1365Z" fill="#763D16" stroke="#763D16" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.16663 8.56712L3.31569 14.1365L2.60663 14.6141L3.74555 15.4856L2.84985 16.1827L3.98877 17.2256L3.25511 17.7633L4.90891 19.6949L12.1233 17.5969L17.2754 13.2173L3.98877 3.33337L2.16663 8.56712Z" fill="#763D16" stroke="#763D16" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M35.0911 19.6949L27.8767 17.5969L29.9166 21.1578L26.8191 27.3091L31.0235 27.2549H37.5553L35.0911 19.6949Z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.1233 17.5969L4.90891 19.6949L2.45435 27.2549H8.97626L13.1809 27.3091L9.94678 21.1578L12.1233 17.5969Z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22.1207 21.4962L22.7246 13.2173L24.5997 7.56671H15.4003L17.2754 13.2173L17.7426 21.4962L17.9192 23.9519L17.9292 30.0058H21.9442L21.9542 23.9519L22.1207 21.4962Z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

type ConnectionStatus = 'idle' | 'connecting' | 'signing' | 'success' | 'error';

interface WalletConnectProps {
  onSuccess?: () => void;
}

export default function WalletConnect({ onSuccess }: WalletConnectProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithWallet, isDemo } = useAuth();
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get redirect URL from location state or default to home
  const from = (location.state as { from?: string })?.from || '/';

  const isMetaMaskInstalled = typeof window !== 'undefined' && window.ethereum?.isMetaMask;

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const connectWallet = useCallback(async () => {
    // In demo mode, simulate wallet connection
    if (isDemo) {
      setStatus('connecting');
      setError(null);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE71';
      setWalletAddress(mockAddress);
      setStatus('signing');
      
      // Simulate signing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { error: signError } = await signInWithWallet(mockAddress, 'mock-signature');
      
      if (signError) {
        setStatus('error');
        setError(signError.message);
        return;
      }
      
      setStatus('success');
      
      // Navigate after successful login
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(from, { replace: true });
        }
      }, 500);
      
      return;
    }

    if (!isMetaMaskInstalled) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setStatus('connecting');
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      setWalletAddress(address);
      setStatus('signing');

      // Create message to sign
      const message = `Sign this message to authenticate with AlgoMart.\n\nWallet: ${address}\nTimestamp: ${Date.now()}`;
      
      // Request signature
      const signature = await window.ethereum!.request({
        method: 'personal_sign',
        params: [message, address],
      }) as string;

      // Authenticate with backend
      const { error } = await signInWithWallet(address, signature);

      if (error) {
        throw error;
      }

      setStatus('success');
      
      // Navigate after successful login
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(from, { replace: true });
        }
      }, 500);
    } catch (err: unknown) {
      setStatus('error');
      if (err && typeof err === 'object' && 'code' in err) {
        const ethError = err as { code: number; message: string };
        if (ethError.code === 4001) {
          setError('Connection request was rejected');
        } else {
          setError(ethError.message || 'Failed to connect wallet');
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to connect wallet');
      }
    }
  }, [isMetaMaskInstalled, signInWithWallet, isDemo, navigate, from, onSuccess]);

  const getButtonContent = () => {
    switch (status) {
      case 'connecting':
        return (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Connecting...</span>
          </>
        );
      case 'signing':
        return (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sign message in wallet...</span>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>Connected: {walletAddress && truncateAddress(walletAddress)}</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>Try again</span>
          </>
        );
      default:
        if (!isMetaMaskInstalled && !isDemo) {
          return (
            <>
              <MetaMaskIcon />
              <span>Install MetaMask</span>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </>
          );
        }
        return (
          <>
            <MetaMaskIcon />
            <span>Connect with MetaMask</span>
          </>
        );
    }
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={connectWallet}
        disabled={status === 'connecting' || status === 'signing' || status === 'success'}
        className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all disabled:cursor-not-allowed ${
          status === 'success'
            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
            : status === 'error'
            ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
            : 'bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 hover:border-slate-600'
        }`}
      >
        {getButtonContent()}
      </button>

      {!isMetaMaskInstalled && !isDemo && (
        <p className="text-xs text-slate-500 text-center">
          MetaMask is required for wallet authentication.{' '}
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300"
          >
            Download here
          </a>
        </p>
      )}

      {status === 'idle' && (isMetaMaskInstalled || isDemo) && (
        <p className="text-xs text-slate-500 text-center">
          {isDemo 
            ? 'Demo mode: Click to simulate wallet connection.'
            : 'Connect your wallet to sign in or create an account automatically.'
          }
        </p>
      )}
    </div>
  );
}
