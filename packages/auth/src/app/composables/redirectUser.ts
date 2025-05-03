import { useRouter } from 'vue-router';

export function redirectUser() {
  const router = useRouter();

  const redirectToDashboard = (userType: string) => {
    switch (userType) {
      case 'superadmin':
        router.push('/superadmin/dashboard');
        break;
      case 'student':
        router.push('/student/dashboard');
        break;
      case 'teacher' :
        router.push('/professors/dashboard');
        break;
      default:
        router.push('/');
        break;
    }
  };

  return { redirectToDashboard };
}
