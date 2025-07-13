
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useSoundContext } from './SoundProvider';

export function Tabs(props) {
    const { t } = useTranslation();
    const { playSound } = useSoundContext();
    const { todos, selectedTab, setSelectedTab } = props
    const tabs = [
        { key: 'All', label: t('tabs.all') },
        { key: 'Incomplete', label: t('tabs.incomplete') },
        { key: 'Completed', label: t('tabs.completed') }
    ]
    

    return (
        <nav className="tab-container">
            <div className="tabs-section">
                {tabs.map((tab, tabIndex) => {
                    const numOfTasks = tab.key === 'All' ? 
                    todos.length :
                    tab.key === 'Incomplete' ?
                            todos.filter(val => !val.complete).length : 
                            todos.filter(val => val.complete).length

                    return (
                                            <button onClick={() => {
                        if (tab.key !== selectedTab) {
                            playSound('tabSwitch');
                        }
                        setSelectedTab(tab.key)
                    }}key={tabIndex} 
                        className={"tab-button " + (tab.key == selectedTab ? ' tab-selected' : ' ')} >
                        <h4>{tab.label} <span>({numOfTasks})</span></h4>
                        </button>
                    )
                })}
            </div>
            <div className="tabs-controls">
                <LanguageSwitcher />
            </div>
            <hr />
        </nav>
    )
} 

