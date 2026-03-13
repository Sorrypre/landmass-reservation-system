let filter_user_search;

const building_map = {
    'Gokongwei Wing': ['G302', 'G303', 'G304', 'G305', 'G306'],
    'Henry Sy Star': ['H802', 'H803', 'H901', 'H1001', 'H1002'],
    'St. Lasalle Ship': ['L220', 'L229', 'L230', 'L319', 'L320']
};

document.addEventListener('DOMContentLoaded', async () => {
    filter_user_search = document.getElementById("filter-user-search")
    await checkLabTechStatus();
});

async function checkLabTechStatus() {
    try {
        const query = await fetch('/query-current-user', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });

        const data = await query.json();

        if (data.success) {
            const user = JSON.parse(data.user)
            if (user.admin && filter_user_search) {
                filter_user_search.classList.remove('hidden');
                return true;
            }
        }
        return false;
    }
    catch(e) {
        console.error('Error checking lab tech status:', e);
        return false;
    }
}