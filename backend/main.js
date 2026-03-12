const filter_user_search = document.getElementById("filter-user-search");

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