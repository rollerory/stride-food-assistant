'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSavedRecipes } from '@/hooks/useDatabase';
import Image from 'next/image';
import styles from '@/styles/pages/profile.module.scss';
import type { SavedRecipe } from '@/types';

import profileIcon from '@assets/icons/profile.svg';
import BackButton from '@/components/BackButton';

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
    if (confirm('Are you sure you want to delete this recipe?')) {
      await removeRecipe(recipeId);
    }
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

        <div className={styles.savedRecipes}>
          <h3 className={styles.savedRecipesTitle}>Saved recipes:</h3>
          
          {/* {recipesLoading && <p>Download recipes...</p>} */}
          {error && <p className={styles.error}>{error}</p>}
          
          {recipes && recipes.length > 0 ? (
            <div className={styles.recipesList}>
              {recipes.map((recipe: SavedRecipe) => (
                <div key={recipe.id} className={styles.recipeCard}>
                  <div className={styles.recipeContent}>
                    <h3 className={styles.recipeTitle}>{recipe.recipe_data?.title || 'A recipe without a name'}</h3>
                    {recipe.recipe_data?.image && (
                      <Image 
                        src={recipe.recipe_data.image} 
                        alt={recipe.recipe_data.title || 'Saved recipe image'}
                        width={200}
                        height={150}
                        className={styles.recipeImage}
                      />
                    )}
                    <p className={styles.savedDate}>
                      Saved: {new Date(recipe.saved_at).toLocaleDateString('uk-UA')}
                    </p>
                  </div>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteRecipe(recipe.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>You haven&apos;t matched any recipes yet</p>
          )}
        </div>

        <BackButton />
      </div>
    </main>
  );
}
