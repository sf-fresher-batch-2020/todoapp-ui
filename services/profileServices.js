class ProfileService {

    constructor(profileService) {
        this.profileService = profileService;
    }

    ngOnInit() {
        this.loadProfile();
    }

    getProfile(uid) {
        var profiles = JSON.parse(localStorage.getItem("PROFILES"));
        for (let profile of profiles) {
            if (profile.uid == uid) {
                return profile;
            }
        }
    }

    updateProfile(uid, fullname, company, gitid) {

        var profiles = JSON.parse(localStorage.getItem("PROFILES"));

        for (let profile in profiles) {
            if (profile.uid == uid) {
                profile.fullname = fullname;
                profile.company = company;
                profile.gitid = gitid;
            }
        }
        localStorage.setItem("PROFILES", JSON.stringify(profiles));
        this.loadProfile();

    }

    loadProfile() {
        authServicesObj = new AuthServices();
        let currentUser = authServicesObj.getCurrentUser();

        let currentProfile = this.getProfile(currentUser.uid);

        let content = "";

        content += `<form onsubmit="updateProfile()">
        <fieldset id="profileEditForm" disabled>
            <div class="form-group" hidden>
                <label for="uid">User Id</label>
                <input type="text" class="form-control" id="uid" value="${currentProfile.uid}">
            </div>
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" class="form-control" disabled value="${currentProfile.name}">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="text" class="form-control" disabled value="${currentProfile.email}">
            </div>
            <div class="form-group">
                <label for="fname">Full name</label>
                <input type="text" class="form-control" id="fname" value="${currentProfile.fullname}" required>
            </div>
            <div class="form-group">
                <label for="company">Company</label>
                <input type="text" class="form-control" id="comp" value="${currentProfile.company}" required>
            </div>
            <div class="form-group">
                <label for="git">Git Username</label>
                <input type="text" class="form-control" id="gitid" value="${currentProfile.gitid}" required>
            </div>
            <button type="submit" class="btn btn-primary">Save</button>
        </fieldset>
        </form>`;

        document.querySelector("#profileForm").innerHTML = content;
        // document.querySelector("#profileEditForm").setAttribute('disabled');
    }

    createProfile(user) {

        var temp = JSON.parse(localStorage.getItem("PROFILES"));
        var profiles = temp ? temp : [];

        let profile_data = {
            'uid': user.uid,
            'name': user.name,
            'email': user.email,
            'fullname': "",
            'company': "",
            'gitid': ""
        };

        profiles.push(profile_data);
        localStorage.setItem("PROFILES", JSON.stringify(profiles));
    }
}