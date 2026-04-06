import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0F11] px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">BRAND NAMING</h1>
        <p className="text-gray-400">계정에 로그인하여 프로젝트를 관리하세요</p>
      </div>
      <LoginForm />
    </div>
  );
}
