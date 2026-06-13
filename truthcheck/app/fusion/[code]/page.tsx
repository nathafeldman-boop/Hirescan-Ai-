import FusionClient from './FusionClient';

export default function FusionSessionPage({ params }: { params: { code: string } }) {
  return <FusionClient code={params.code.toUpperCase()} />;
}
