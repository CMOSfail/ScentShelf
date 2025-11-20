import Collection from './pages/Collection';
import PerfumeDetail from './pages/PerfumeDetail';
import PerfumeForm from './pages/PerfumeForm';
import TagManagement from './pages/TagManagement';
import Statistics from './pages/Statistics';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Collection": Collection,
    "PerfumeDetail": PerfumeDetail,
    "PerfumeForm": PerfumeForm,
    "TagManagement": TagManagement,
    "Statistics": Statistics,
}

export const pagesConfig = {
    mainPage: "Collection",
    Pages: PAGES,
    Layout: __Layout,
};