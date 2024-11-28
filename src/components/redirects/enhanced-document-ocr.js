import React, { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';

export default function Redirect() {
  const history = useHistory();
  const location = useLocation();
  
  useEffect(() => {
    history.replace('/docs/add-on-modules/modules/enhanced-document-ocr' + location.hash);
  }, []);

  return null;
}