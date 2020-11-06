class ProfileService {

    constructor(profileService) {
        this.profileService = profileService;
    }

    ngOnInit() {
        this.loadProfile();
    }

    // returns a profile based on the uid passed
    getProfile(uid) {
        var profiles = JSON.parse(localStorage.getItem("PROFILES"));
        for (let profile of profiles) {
            if (profile.uid == uid) {
                return profile;
            }
        }
    }


    // passes the profile data to the edit profile modal
    openEditModal() {
        authServicesObj = new AuthServices();
        let currentUser = authServicesObj.getCurrentUser();
        let currentProfile = this.getProfile(currentUser.uid);
        let editForm = `<form onsubmit="updateProfile()">
                        <div>
                            <input type="text" class="d-none" name="uid" id="uid" value="${currentProfile.uid}" autofocus>
                        </div>
                        <div class="form-group">
                        <label for="fullname">Full Name</label>
                            <input type="text" id="fullname" class="form-control" value="${currentProfile.fullname}">
                        </div>
                        <div class="form-group">
                            <label for="company">Company</label>
                            <input type="text" id="company" class="form-control" value="${currentProfile.company}">
                        </div>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </form>`;

        document.querySelector("#editform").innerHTML = editForm;
    }

    // updates the profile data with passed values
    updateProfile(uid, fullname, company) {

        var profiles = JSON.parse(localStorage.getItem("PROFILES"));

        for (let profile of profiles) {
            if (profile.uid == uid) {
                profile.fullname = fullname;
                profile.company = company;
            }
        }

        localStorage.setItem("PROFILES", JSON.stringify(profiles));
        this.loadProfile();
    }

    // fetches the profile of current user and renders with user profile page
    loadProfile() {
        authServicesObj = new AuthServices();
        let currentUser = authServicesObj.getCurrentUser();

        let currentProfile = this.getProfile(currentUser.uid);

        let content = "";

        content = `<table class="table table-hover table-sm m-5">
        <tbody>
            <tr>
                <th scope="row">User Name</th>
                <td>${currentProfile.name}</td>
            </tr>
            <tr>
                <th scope="row">Email</th>
                <td>${currentProfile.email}</td>
            </tr>
            <tr>
                <th scope="row">Full Name</th>
                <td>${currentProfile.fullname}</td>
            </tr>
            <tr>
                <th scope="row">Company</th>
                <td>${currentProfile.company}</td>
            </tr>
        </tbody>
    </table>`;

        document.querySelector("#profileForm").innerHTML = content;
    }

    // creates a user profile
    createProfile(user) {
        var temp = JSON.parse(localStorage.getItem("PROFILES"));
        var profiles = temp ? temp : [];

        let profile_data = {
            'uid': user.uid,
            'name': user.name,
            'email': user.email,
            'fullname': "",
            'company': ""
        };

        profiles.push(profile_data);
        localStorage.setItem("PROFILES", JSON.stringify(profiles));
    }
}