import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseMenu } from '../components';

function NotFoundPage() {
  const { t } = useTranslation('general');

  return (
    <div>
      <BaseMenu />
      <h1>{t('pageNotFoundMessage')}</h1>
    </div>
  );
}

export default NotFoundPage;
