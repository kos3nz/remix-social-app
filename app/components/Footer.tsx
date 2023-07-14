const Footer = () => {
  return (
    <footer className="fixed left-0 bottom-0 flex w-full flex-wrap items-center justify-center gap-y-2 gap-x-4 py-3 px-2 dark:bg-black md:px-6">
      <div className="flex items-center">
        <div className="h-6 w-16">
          <img
            src="https://rb.gy/vtbzlp"
            alt="header"
            className="object-contain"
          />
        </div>
        <span className="text-xs dark:text-white/90">© 2022</span>
      </div>
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs dark:text-white/90">
        <li className="cursor-pointer hover:underline">User Agreement</li>
        <li className="cursor-pointer hover:underline">Privacy Policy</li>
        <li className="cursor-pointer hover:underline">Community Guidelines</li>
        <li className="cursor-pointer hover:underline">Cookie Policy</li>
        <li className="cursor-pointer hover:underline">Copyright Policy</li>
        <li className="cursor-pointer hover:underline">Send Feedback</li>
      </ul>
    </footer>
  );
};

export default Footer;
