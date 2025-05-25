        // {/* Sidebar */}
        // <div className="sidebar w-64 text-white p-4 flex flex-col">
        //     <div className="mb-10">
        //         <h1 className="text-xl font-bold mb-1" onClick={() => navigate('/home')}>ChainSign</h1>
        //         <p className="text-xs text-indigo-200">Blockchain Belge Yönetimi</p>
        //     </div>

        //     <nav className="space-y-1 flex-1">
        //     <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md">
        //         <FileText className="mr-3 h-5 w-5" />
        //         Belgelerim
        //     </a>
        //     <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md">
        //         <Clock className="mr-3 h-5 w-5" />
        //         İmza Bekleyenler
        //     </a>
        //     <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md">
        //         <CheckCircle className="mr-3 h-5 w-5" />
        //         Tamamlananlar
        //     </a>
        //     <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md">
        //         <Users className="mr-3 h-5 w-5" />
        //         Organizasyon
        //     </a>
        //     </nav>

        //     {currentUser && (
        //     <div className="pt-4 border-t border-indigo-600 mt-4">
        //         <div className="flex items-center">
        //         <div className="ml-3">
        //             <p className="text-sm font-medium">{currentUser.name}</p>
        //             <p className="text-xs text-indigo-300">{currentUser.role}</p>
        //         </div>
        //         </div>

        //         <div className="mt-3 flex items-center text-sm text-indigo-200">
        //         {isWalletConnected ? (
        //             <span className="flex items-center">
        //             <span className="h-2 w-2 bg-green-400 rounded-full mr-1"></span>
        //             Cüzdan Bağlı
        //             </span>
        //         ) : (
        //             <button 
        //             type="button"
        //             onClick={connectWallet}
        //             className="text-indigo-200 hover:text-white text-sm"
        //             >
        //             ArgentX Cüzdanı Bağla
        //             </button>
        //         )}
        //         </div>

        //         <button 
        //         type="button"
        //         onClick={() => {
        //             setCurrentUser(null);
        //             setIsWalletConnected(false);
        //             navigate('/');
        //         }}
        //         className="mt-4 flex items-center text-indigo-200 hover:text-white text-sm">
        //         <LogOut className="mr-2 h-4 w-4" />
        //         Çıkış Yap
        //         </button>
        //     </div>
        //     )}
        // </div>