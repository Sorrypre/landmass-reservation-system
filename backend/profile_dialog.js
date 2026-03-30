async function createProfileDialog(email) {
    const user = await fetch('/query-get-user', {
        METHOD: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
           email,
        })
    });
    if(user.status !== 404){
        const user_json = await user.json();
        
        const profile_pfp = JSON.parse(user_json.user).settings.photo;
        const profile_name =  JSON.parse(user_json.user).settings.username;
        const profile_bio = JSON.parse(user_json.user).settings.bio;
        const profile_email = email;

        const htmlbody = `
            <div id="profile-info-content">
                <div id="profile-card">
                    <div id="photo-holder"> 
                        <!---->
                        <img id="profilepic" class="profile-img" src=${profile_pfp}>
                    </div>
                    <div id="profile-content">
                        <div id="profile-name-container">
                        <p id="profile-name">${profile_pfp}</p>
                        </div>
                        <div id="profile-info">
                            <p class="text-info-title">Description: <p>
                            <p id="profile-description" class="text-info-content">${profile_bio}</p>
                        <br>
                            <p class="text-info-title">Email: </p>
                            <p id="profile-email" class="text-info-content">${email}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const res = `
                <button type="button" id="leave-pfp-dialog" target-dialog-command="closedel" target-dialog-id="view-profile-dialog" class="page-dialog-message-button after:content-['Exit'] text-black"></button>
        `;
        make_dialog('reservation-list', '', 'view-profile-dialog', 'typical', 'Profile', false, false, htmlbody, res);
    } else {
        console.log('User not found');
    }
};