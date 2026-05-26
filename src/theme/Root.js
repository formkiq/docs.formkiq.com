import React, {useEffect} from 'react';

const CLOUDFORMATION_HOST = 'console.aws.amazon.com';
const CLOUDFORMATION_EVENT = 'cloudformation_install_click';

function getHashParams(url) {
  const hashQuery = url.hash.includes('?') ? url.hash.split('?')[1] : '';
  return new URLSearchParams(hashQuery);
}

function getTemplateName(templateUrl) {
  if (!templateUrl) return '';

  try {
    const url = new URL(templateUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    return pathParts[pathParts.length - 1] || '';
  } catch (error) {
    return '';
  }
}

function isCloudFormationLink(url) {
  return url.hostname === CLOUDFORMATION_HOST && url.pathname.includes('/cloudformation/');
}

function trackCloudFormationClick(link) {
  if (typeof window.gtag !== 'function') return;

  try {
    const url = new URL(link.href);
    if (!isCloudFormationLink(url)) return;

    const hashParams = getHashParams(url);
    const templateUrl = hashParams.get('templateURL') || '';

    window.gtag('event', CLOUDFORMATION_EVENT, {
      region: url.searchParams.get('region') || '',
      stack_name: hashParams.get('stackName') || '',
      template_url: templateUrl,
      template_name: getTemplateName(templateUrl),
      docs_path: window.location.pathname,
      link_text: link.textContent.trim(),
      transport_type: 'beacon',
    });
  } catch (error) {
    // Ignore malformed links.
  }
}

function CloudFormationInstallTracking() {
  useEffect(() => {
    function handleClick(event) {
      const target = event.target;
      const link = target && typeof target.closest === 'function'
        ? target.closest('a[href]')
        : null;
      if (!link) return;

      trackCloudFormationClick(link);
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}

export default function Root({children}) {
  return (
    <>
      <CloudFormationInstallTracking />
      {children}
    </>
  );
}
