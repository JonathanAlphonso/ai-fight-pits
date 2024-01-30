function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex items-center justify-center w-full h-24 border-t bg-[#2e026d] border-white p-4 px-6">
      <p
        className="flex items-center justify-center cursor-pointer text-white text-xl md:text-2xl hover:text-blue-500 transition-colors"
      >
        {`Copyright Jonathan Alphonso ${currentYear}`}
      </p>
    </footer>
  );
}

export default Footer;