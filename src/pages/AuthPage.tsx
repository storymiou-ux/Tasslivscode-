import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Package,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  Truck,
  X,
  AlertCircle
} from 'lucide-react';
import { signUp, signIn } from '../lib/auth';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode');
  const confirmed = searchParams.get('confirmed');
  const [isLogin, setIsLogin] = useState(mode !== 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'login') {
      setIsLogin(true);
    } else if (mode === 'signup') {
      setIsLogin(false);
    }
  }, [mode]);

  useEffect(() => {
    if (confirmed === 'true') {
      setSuccess('Email confirmé avec succès ! Vous pouvez maintenant vous connecter.');
      setIsLogin(true);
      window.history.replaceState({}, '', '/auth?mode=login');
    }
  }, [confirmed]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+221',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessType: '',
    agreeToTerms: false
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLogin) {
        const result = await signIn({
          email: formData.email,
          password: formData.password,
        });

        if (result.user && !result.user.email_confirmed_at) {
          setError('Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.');
          setLoading(false);
          return;
        }

        setSuccess('Connexion réussie !');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          setLoading(false);
          return;
        }

        const result = await signUp({
          email: formData.email,
          password: formData.password,
          fullName: formData.name,
          phone: formData.phone,
          businessName: formData.businessName,
        });

        if (result.user && !result.user.email_confirmed_at) {
          setSuccess('Compte créé ! Veuillez vérifier votre email pour confirmer votre inscription.');
          setFormData({
            name: '',
            email: '',
            phone: '+221',
            password: '',
            confirmPassword: '',
            businessName: '',
            businessType: '',
            agreeToTerms: false
          });
          setLoading(false);
          return;
        }

        setSuccess('Compte créé avec succès ! Redirection...');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.message?.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect');
      } else if (err.message?.includes('User already registered')) {
        setError('Un compte existe déjà avec cet email');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.');
      } else {
        setError(err.message || 'Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-sky-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="absolute top-6 left-6 flex items-center space-x-3 z-50">
        <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl">
          <Package className="h-8 w-8 text-white" />
        </div>
        <span className="text-white text-2xl font-bold">Tassli</span>
      </div>

      <button
        onClick={() => navigate('/')}
        className="absolute top-6 right-6 p-2.5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all z-50"
        aria-label="Retour à l'accueil"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      <div className="max-w-md w-full relative z-10 mt-20">

        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all"
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Numéro de téléphone
                  </label>
                  <div className="flex items-center">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all"
                      placeholder="+221771234567"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Format: +221 suivi de 9 chiffres</p>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all"
                placeholder=""
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                {isLogin && (
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot your password?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all"
                  placeholder=""
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all"
                  placeholder=""
                  required
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="text-sm text-gray-700 font-medium">
                  Remember me on this device
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Chargement...' : (isLogin ? 'Sign in' : 'Create account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {isLogin ? "New to Tassli?" : "Already have an account?"}
              {' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                {isLogin ? "Create account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        <div className="text-center text-white/60 text-sm">
          <div className="flex items-center justify-center space-x-1">
            <Lock className="h-4 w-4" />
            <span>Secured and encrypted connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;