async function createProfileDialog(email) {
    const user = await fetch('/query-get-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
           email,
        })
    });
    if(user.status !== 404){
        const user_json = await user.json();
        
        const profile_pfp = JSON.parse(user_json.user).settings.photo !== '' ? JSON.parse(user_json.user).settings.photo : '../frontend/assets/images/pexels-cottonbro-7166828.jpg';
        const profile_name =  JSON.parse(user_json.user).settings.username;
        const profile_bio = JSON.parse(user_json.user).settings.bio 

        const profile_email = email;

        const htmlbody = `
            <div id="profile-info-content-dialog">
                <div id="profile-card-dialog">
                    <div id="photo-holder-dialog"> 
                        <!---->
                        <img id="profilepic-dialog" class="profile-img" src=${profile_pfp}>
                    </div>
                    <div id="profile-content-dialog">
                        <div id="profile-name-container-dialog">
                        <p id="profile-name-dialog">${profile_name}</p>
                        </div>
                        <div id="profile-info-dialog">
                            <p class="text-info-title">Description: <p>
                            <p id="profile-description-dialog" class="text-info-content">${profile_bio}</p>
                        <br>
                            <p class="text-info-title">Email: </p>
                            <p id="profile-email-dialog" class="text-info-content">${profile_email}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const res = ``
            
        make_dialog('reservation-list', '', 'view-profile-dialog', 'typical', 'Profile', false, false, htmlbody, res);

        await open_dialog('view-profile-dialog');
    } else {
        console.log('User not found');
    }
};