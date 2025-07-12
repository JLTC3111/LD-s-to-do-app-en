
import soundManager from '../utils/sounds';

export function Tabs(props) {
    const { todos, selectedTab, setSelectedTab } = props
    const tabs = ['All', 'Incomplete', 'Completed']
    

    return (
        <nav className="tab-container">
            {tabs.map((tab, tabIndex) => {
                const numOfTasks = tab === 'All' ? 
                todos.length :
                tab === 'Incomplete' ?
                        todos.filter(val => !val.complete).length : 
                        todos.filter(val => val.complete).length

                return (
                    <button onClick={() => {
                        if (tab !== selectedTab) {
                            soundManager.playTabSwitch();
                        }
                        setSelectedTab(tab)
                    }}key={tabIndex} 
                    className={"tab-button " + (tab == selectedTab ? ' tab-selected' : ' ')} >
                    <h4>{tab} <span>({numOfTasks})</span></h4>
                    </button>
                )
            })}
            <hr />
        </nav>
    )
} 

