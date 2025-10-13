import { useState } from "react";
import { PsychologyPage } from "./pages/PsychologyPage";
import { PsychologyFormPage } from "./pages/PsychologyFormPage";
import { PsychologyViewPage } from "./pages/PsychologyViewPage";

type ViewType = 'list' | 'form' | 'view';

interface NavigationState {
  view: ViewType;
  editId?: string;
  viewId?: string;
}

export function Psychology() {
  const [navigation, setNavigation] = useState<NavigationState>({ view: 'list' });

  const handleNavigate = (view: ViewType, id?: string) => {
    if (view === 'form') {
      setNavigation({ view: 'form', editId: id });
    } else if (view === 'view') {
      setNavigation({ view: 'view', viewId: id });
    } else {
      setNavigation({ view: 'list' });
    }
  };

  const renderCurrentView = () => {
    switch (navigation.view) {
      case 'form':
        return (
          <PsychologyFormPage 
            editId={navigation.editId}
            onBack={() => handleNavigate('list')}
            onSave={() => handleNavigate('list')}
          />
        );
      case 'view':
        return (
          <PsychologyViewPage 
            viewId={navigation.viewId}
            onBack={() => handleNavigate('list')}
            onEdit={(id) => handleNavigate('form', id)}
          />
        );
      default:
        return (
          <PsychologyPage 
            onCreateNew={() => handleNavigate('form')}
            onEdit={(id) => handleNavigate('form', id)}
            onView={(id) => handleNavigate('view', id)}
          />
        );
    }
  };

  return renderCurrentView();
}