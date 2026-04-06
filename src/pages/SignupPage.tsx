import SignupForm from '../components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0F11] px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">BRAND NAMING</h1>
        <p className="text-gray-400">새로운 여정을 시작하세요</p>
      </div>
      <SignupForm />
    </div>
  );
}
