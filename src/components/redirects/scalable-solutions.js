import React, { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';

export default function Redirect() {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    history.replace('/docs/tutorials/solution-patterns/build-scalable-solutions-using-formkiq' + location.hash);
  }, []);

  return null;
}
