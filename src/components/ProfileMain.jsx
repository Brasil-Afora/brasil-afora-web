import React, { useState, useEffect } from 'react';
import ProfileOpportunities from './ProfileOpportunities';
import ProfileCollegeList from './ProfileCollegeList';

function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}

const ProfileMain = () => {
    const [myCollegeList, setMyCollegeList] = useLocalStorage("myCollegeList", []);
    const [favoriteOpportunities, setFavoriteOpportunities] = useLocalStorage("favorites", []);
    const [applicationChecklist, setApplicationChecklist] = useLocalStorage("applicationChecklist", {});
    const [activeTab, setActiveTab] = useState('favorites');
    const [confirmationPopup, setConfirmationPopup] = useState(null);
    const [popup, setPopup] = useState({ visible: false, message: '' });

    useEffect(() => {
        if (popup.visible) {
            const timer = setTimeout(() => {
                setPopup({ ...popup, visible: false });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [popup]);

    const handleRemoveFromList = (id, listName, name) => {
        setConfirmationPopup({ id, listName, name });
    };

    const handleConfirmRemove = () => {
        const { id, listName, name } = confirmationPopup;
        if (listName === "myCollegeList") {
            setMyCollegeList(myCollegeList.filter(uni => uni.id !== id));
            setApplicationChecklist(prev => {
                const newChecklist = { ...prev };
                delete newChecklist[id];
                return newChecklist;
            });
        } else if (listName === "favorites") {
            setFavoriteOpportunities(favoriteOpportunities.filter(fav => fav.id !== id));
        }
        setPopup({ visible: true, message: `"${name}" removido(a) com sucesso!` });
        setConfirmationPopup(null);
    };

    const handleCancelRemove = () => {
        setConfirmationPopup(null);
    };

    return (
        <div className="bg-slate-950 min-h-screen text-white p-8 font-inter">
            <h1 className="text-5xl font-extrabold mb-8 text-amber-500 text-center">Meu Perfil</h1>

            <div className="bg-slate-900 rounded-full p-1 mb-8 flex w-full max-w-sm mx-auto shadow-lg border border-slate-950">
                <button
                    className={`flex-1 py-2 px-4 rounded-full font-semibold transition-colors duration-200 text-sm ${activeTab === 'favorites' ? 'bg-amber-500 text-black' : 'text-white hover:bg-slate-800'}`}
                    onClick={() => setActiveTab('favorites')}
                >
                    Intercâmbios Salvos
                </button>
                <button
                    className={`flex-1 py-2 px-4 rounded-full font-semibold transition-colors duration-200 text-sm ${activeTab === 'collegeList' ? 'bg-amber-500 text-black' : 'text-white hover:bg-slate-800'}`}
                    onClick={() => setActiveTab('collegeList')}
                >
                    Minha College List
                </button>
            </div>
            
            {activeTab === 'favorites' ? (
                <ProfileOpportunities
                    favoriteOpportunities={favoriteOpportunities}
                    handleRemoveFromList={handleRemoveFromList}
                />
            ) : (
                <ProfileCollegeList
                    myCollegeList={myCollegeList}
                    applicationChecklist={applicationChecklist}
                    setApplicationChecklist={setApplicationChecklist}
                    handleRemoveFromList={handleRemoveFromList}
                />
            )}

            {confirmationPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="bg-slate-900 p-8 rounded-lg shadow-xl text-center w-full max-w-md border border-slate-950">
                        <p className="text-lg text-white mb-6">
                            Tem certeza que deseja remover <span className="text-amber-500 font-semibold">{confirmationPopup.name}</span> da sua lista?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleConfirmRemove}
                                className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-full hover:bg-amber-600 transition-colors"
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={handleCancelRemove}
                                className="px-6 py-2 bg-slate-950 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {popup.visible && (
                <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white p-4 rounded-lg shadow-lg flex items-center gap-4 border border-slate-950">
                    <span>{popup.message}</span>
                    <button onClick={() => setPopup({ ...popup, visible: false })} className="text-white hover:text-gray-200">
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileMain;