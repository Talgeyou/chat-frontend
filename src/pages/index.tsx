import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Chat from '@/widgets/chat';

export default function Home() {
  return (
    <main className="bg-purple-50 h-screen w-full overflow-hidden flex flex-col justify-center items-center px-4">
      <Chat />
    </main>
  );
}

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
    },
  };
}
