'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSavedRecipes } from '@/hooks/useDatabase';
import Image from 'next/image';
import styles from '@/styles/pages/profile.module.scss';
import profileIcon from '@assets/icons/profile.svg';
import BackButton from '@/components/BackButton';
import SavedRecipes from '@/components/SavedRecipes';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const { recipes, loading: recipesLoading, error, removeRecipe } = useSavedRecipes();

  if (authLoading) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    await removeRecipe(recipeId);
  };

  return (
    <main className={styles.page}>
        <div className="container">
        <div className={styles.header}>
          <div className={styles.title}>
            <h1>My profile</h1>
            <Image 
              className={styles.titleIcon} 
              width={44}
              height={44}
              src={profileIcon}
              alt="food icon" />
          </div>
          <div className={styles.userInfo}>
              <h3>Username:</h3>
              <span className={styles.value}>{user?.username}</span>
          </div>

          <button 
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <SavedRecipes recipes={recipes} recipesLoading={recipesLoading} error={error} handleDeleteRecipe={handleDeleteRecipe} />

        <BackButton />
      </div>
    </main>
  );
}
