import React from 'react';
import release from '@site/config/release.cjs';

const regions = [
  ['us-east-1', 'N. Virginia'], ['us-east-2', 'Ohio'],
  ['us-west-2', 'Oregon'], ['ca-central-1', 'Canada (Central)'],
  ['ca-west-1', 'Canada (West)'], ['eu-central-1', 'Frankfurt'],
  ['eu-west-1', 'Ireland'], ['eu-west-2', 'London'], ['eu-west-3', 'Paris'],
  ['eu-north-1', 'Stockholm'], ['eu-south-1', 'Milan'],
  ['ap-south-1', 'Mumbai'], ['ap-southeast-1', 'Singapore'],
  ['ap-southeast-2', 'Sydney'], ['ap-northeast-1', 'Tokyo'],
  ['ap-northeast-2', 'Seoul'], ['af-south-1', 'Cape Town'],
  ['sa-east-1', 'São Paulo'],
];

export default function InstallationLinks({vpc = false}) {
  const label = vpc ? 'Install VPC' : 'Install FormKiQ';
  return (
    <>
      <p>Templates for FormKiQ {release.version}. Confirm service availability in your target region.</p>
      <table>
        <thead><tr><th>Region</th><th>Location</th><th>Installation</th></tr></thead>
        <tbody>
          {regions.map(([region, location]) => {
            const template = `https://formkiq-core-distribution-${region}.s3.${region}.amazonaws.com/${release.version}/${vpc ? 'vpc' : 'template'}.yaml`;
            const url = `https://console.aws.amazon.com/cloudformation/home?region=${region}#/stacks/new?stackName=${vpc ? 'formkiq-vpc' : 'formkiq-prod'}&templateURL=${template}`;
            return <tr key={region}><td>{region}</td><td>{location}</td><td><a href={url}>{label}</a></td></tr>;
          })}
        </tbody>
      </table>
    </>
  );
}
