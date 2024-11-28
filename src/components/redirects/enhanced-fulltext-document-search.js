import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

export default function Redirect() {
  const history = useHistory();
  
  useEffect(() => {
    history.replace('/docs/add-on-modules/modules/enhanced-fulltext-document-search');
  }, []);

  return null;
}