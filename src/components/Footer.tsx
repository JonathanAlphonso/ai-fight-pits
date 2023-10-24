import { useRouter } from 'next/router';

function Footer() {
  const router = useRouter();

  return (
    <footer className="flex items-center justify-center w-full h-24 border-t bg-[#2e026d] border-white p-4 px-6">
      <p
        className="flex items-center justify-center cursor-pointer whitespace-nowrap text-white text-2xl hover:text-blue-500 transition-colors"
        
      >
        Copyright Jonathan Alphonso 2023
       
      </p>
    </footer>
  );
}

export default Footer;