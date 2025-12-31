Чтобы использоваться компонент <Tab>, надо добавить на странице:

import { useState } from 'react';
import { Tab, TabsContainer } from '@/shared/ui/Tab/Tab';
const [activeTab, setActiveTab] = useState<string>('all');

{/_ === ПРИМЕР ИСПОЛЬЗОВАНИЯ TABS === _/}

<section
style={{
padding: '40px 20px',
maxWidth: '800px',
margin: '40px auto',
}}
>
<TabsContainer>
<Tab
id="all"
label="Все задачи"
selected={activeTab === 'all'}
onClick={() => setActiveTab('all')}
/>
<Tab
id="active"
label="Активные"
selected={activeTab === 'active'}
onClick={() => setActiveTab('active')}
/>
<Tab
id="completed"
label="Завершенные"
selected={activeTab === 'completed'}
onClick={() => setActiveTab('completed')}
/>
<Tab
id="postponed"
label="Отложенные"
selected={activeTab === 'postponed'}
disabled={true}
/>
</TabsContainer>

        <div>
          {activeTab === 'all' && (
            <div>
              <h3 style={{ color: '#fff' }}>Все задачи</h3>
              <p>Здесь отображаются все ваши задачи</p>
            </div>
          )}
          {activeTab === 'active' && (
            <div>
              <h3 style={{ color: '#fff' }}>Активные задачи</h3>
              <p>Задачи, которые находятся в работе</p>
            </div>
          )}
          {activeTab === 'completed' && (
            <div>
              <h3 style={{ color: '#fff' }}>Завершенные задачи</h3>
              <p>Задачи, которые уже выполнены</p>
            </div>
          )}
        </div>
      </section>
