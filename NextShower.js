




const app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data () {
        return {
            login: false,
            personName: null,
            itemsPerPage: 4,
            addPersonDialog: false,
            userid: null,
            docid: null,
            imgpath: null,
            stp1: false,
            stp2: false,
            e1: 1,
            files: [],
            personFiles: [],
            personImage: null,
            parent: null,
            gender: null,
            agreement: false,
            dialog: false,
            family: null,
            email: undefined,
            form: false,
            isLoading: false,
            password: undefined,
            err: false,
            scss:false,
            rules: {
                email: v => !!(v || '').match(/@/) || 'נא להקליד כתובת מייל תקנית',
                password: v => !!(v || '').match(/^(?=.*[a-z])(?=.*[A-Z]).+$/) ||
                'אותיות קטנות וגדולות',
                required: v => !!v || 'שדה זה הינו חובה',
            },

            dialog: false,
            title: 'מי ראשון למקלחת?',
            vrow: false,
            familycards: [],
            gen_index:{"בן": "m", "בת": "f"},
            order_dictionary : {

            '0_m': 'ראשון',
            '1_m': 'שני',
            '2_m': 'שלישי',
            '3_m': 'רביעי',
            '4_m': 'חמישי',
            '5_m': 'שישי',
            '6_m': 'שביעי',
            '7_m': 'שמיני',
            '8_m': 'תשיעי',
            '9_m': 'עשירי',
            '0_f': 'ראשונה',
            '1_f': 'שניה',
            '2_f': 'שלישית',
            '3_f': 'רביעית',
            '4_f': 'חמישית',
            '5_f': 'שישית',
            '6_f': 'שביעית',
            '7_f': 'שמינית',
            '8_f': 'תשיעית',
            '9_f': 'עשירית',
            },
            gen_parents:{
                'אבא': 'm',
                'אמא': 'f',
            },
            loading: false,
            loading_text: "",
            welcome: ""
        }
    },
    methods: {

        login_true()
        {
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                  // User is signed in.
                  console.log(user.uid);


                  // Create a reference to the cities collection
                  var dref = db.collection("cards");
  
                  // Create a query against the collection.
                  var query = dref.where("userid", "==", user.uid);
                  query.get().then(function (querySnapshot) {
                      querySnapshot.forEach(function (doc) {
                          console.log(doc.data().familycards);
                          app.familycards = doc.data().familycards;
                          app.login= false;
                          app.welcome = "שלום, משפחת " + doc.data().family + "!";
  
                          var enter = document.getElementById("enter");
                          enter.hidden = true;
  
                          var exit  = document.getElementById("exit");
                          exit.hidden = false;
                      });
                  });

                } else {
                    app.login = true;
                }
            });
        },
        reset(){
            this.password = null;
            this.email = null;
         
        },
        loginPerson()
        {

            const email = this.email;
            const password = this.password;
            console.log(email, password);



            firebase.auth().signInWithEmailAndPassword(email, password).then(cred => {

                console.log(cred.user.uid);


                // Create a reference to the cities collection
                var dref = db.collection("cards");

                // Create a query against the collection.
                var query = dref.where("userid", "==", cred.user.uid);
                query.get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        console.log(doc.data().familycards);
                        app.familycards = doc.data().familycards;
                        app.login= false;
                        app.welcome = "שלום, משפחת " + doc.data().family + "!";

                        var enter = document.getElementById("enter");
                        enter.hidden = true;

                        var exit  = document.getElementById("exit");
                        exit.hidden = false;
                    });
                });
            });
        },

        signUp()
        {
            this.stp1 = true;
            // get user info
            const email = this.email;
            const password = this.password;


            // sign up the user & add firestore data
            auth.createUserWithEmailAndPassword(email, password).then(cred => {
                console.log(cred);
                this.userid = cred.user.uid;
                db.collection('cards').add(
                    {

                        gen: null, //this.gen_parents[this.parent],
                        src: null, //"this.files",
                        title:  null, //this.parent,
                        userid: cred.user.uid,
                        familycards: [],
                        family: app.family
                    }
                ).then(function(docRef) {
                    app.docid = docRef.id;
                    console.log("thats all");
                });
            }).then(() => {
                console.log("ok");

            }).catch(err => {
                console.log("error");
            });

  
        },


      signIn()
      {
            this.dialog = false;
             // get user info
            const email = this.email
            const password = this.password;

      },

      Changed()
      {


        if (app.familycards.length > 0)
        {
            var div = document.getElementById("circles");
            div.hidden = false;
            
            var faces_div = document.getElementById("faces");
            faces_div.hidden = true;

            this.title ='מי ראשון למקלחת?';

            setTimeout(function(){

            app.title = app.familycards[0].name +"!";

            var div = document.getElementById("circles");
            div.hidden = true;
            var faces_div = document.getElementById("faces");
            faces_div.hidden = false;


            }, 5000);

            let array2 = [];
            while (this.familycards.length != 0)
            {
                let randomIndex = Math.floor(Math.random() * this.familycards.length);
                array2.push(this.familycards[randomIndex]);
                this.familycards.splice(randomIndex, 1)

            }
            this.familycards = array2;
        }
        else
        {
            app.err = true;
        }

      },

      loadImage()
      {
        console.log("loadImage");          //checks if files are selected
        this.loading = true;
        this.loading_text = "טוען קובץ תמונה..."
        if (this.files) {

            //create a storage reference
            var storage = firebase.storage().ref(this.files.name);
            //alert(this.files.name);

            //upload file
            var upload = storage.put(this.files);

            //update progress bar
            upload.on(
                "state_changed",
                function progress(snapshot) {
                var percentage =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },

                function error() {
                alert("error uploading file");
                },

                function complete() {
                    console.log("img uploaded!")
                    console.log("getFileUrl");
                    //create a storage reference
                    var storage = firebase.storage().ref(app.files.name);
                    //get file url
                    storage
                      .getDownloadURL()
                      .then(function(url) {
                        console.log(url);
                        app.imgpath =  url;
                        db.collection('cards').doc(app.docid).update({
                            gen: app.gen_parents[app.parent],
                            src: app.imgpath,
                            title: app.parent,
                            familycards: [{"name": app.parent, "image": app.imgpath, "gen": app.gen_parents[app.parent], flex: 12}]
                          });
                          app.familycards.push({"name": app.parent, "image": app.imgpath, "gen": app.gen_parents[app.parent], flex: 12});
                          app.stp2 = true;
                      })
                      .catch(function(error) {
                        console.log("error encountered");
                      });

                }
            );

        } else {
            alert("No file chosen");
        }
        this.loading = false;
        this.loading_text = "";

      },

      loadPersonImage()
      {
        console.log("loadImage");          //checks if files are selected
        if (this.personFiles) {

            //create a storage reference
            var storage = firebase.storage().ref(this.personFiles.name);
            //alert(this.personFiles.name);

            //upload file
            var upload = storage.put(this.personFiles);

            //update progress bar
            upload.on(
                "state_changed",
                function progress(snapshot) {
                var percentage =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },

                function error() {
                alert("error uploading file");
                },

                function complete() {
                    
                    console.log("img uploaded!")
                    console.log("getFileUrl");
                    //create a storage reference
                    var storage = firebase.storage().ref(app.personFiles.name);
                    //get file url
                    storage
                      .getDownloadURL()
                      .then(function(url) {
                        console.log(url);
                        app.personImage =  url;
                          app.familycards.push({"name": app.personName, "image": app.personImage, "gen":  app.gen_index[app.gender], flex: 12});
                      })
                      .catch(function(error) {
                        console.log("error encountered");
                      });
                      app.addPersonDialog = false;
                      app.personFiles = null;

                }
            );

        } else {
            alert("No file chosen");
        }

      },

      doneRegisting()
      {

        db.collection('cards').doc(app.docid).update({
            gen: app.gen_parents[app.parent],
            src: app.imgpath,
            title: app.parent,
            familycards: app.familycards
          });
          this.dialog=false;
          this.scss = true;
          app.welcome = "שלום משפחת " + app.family

          var enter = document.getElementById("enter");
          enter.hidden = true;

          var exit  = document.getElementById("exit");
          exit.hidden = false;


      },
      signOut()
      {
        firebase.auth().signOut().then(function() {
            console.log("Sign-out successful.");
            app.welcome = "";

            var enter = document.getElementById("enter");
            enter.hidden = false;
  
            var exit  = document.getElementById("exit");
            exit.hidden = true;

            app.familycards = [];

            app.title ='מי ראשון למקלחת?';

          }).catch(function(error) {
            console.log("Sign-out Error.");
          });
      }
     
    },


    
    computed: {
        isDisabled: function(){
          return !this.stp1;
         },
        isDisabled2: function(){
        return !this.stp2;
        }
    }
  });
