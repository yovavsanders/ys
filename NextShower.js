


var dref ;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data () {
        return {
            names: [],
            names_selected: [],
            reg_failed: false,
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
            upload_failed: false,
            rules: {
                email: v => !!(v || '').match(/@/) || 'נא להקליד כתובת מייל תקנית',
                password: v => !!(v || '').match(/^(?=.*[a-z])(?=.*[A-Z]).{7,}/) ||
                'מינימום 7 אותיות קטנות וגדולות',
                required: v => !!v || 'שדה זה הינו חובה',
            },

            dialog: false,
            settings: false,
            title: 'מי ראשון למקלחת?',
            vrow: false,
            familycards: [],
            familycards_selected: [],
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
            welcome: "",
            signbtn: true
        }
    },
    computed: {
        All() {
            return this.names_selected.length === this.names.length
        },
        Some() {
            return this.names_selected.length > 0 && !this.All
        },
        icon() {
            if (this.All) return 'mdi-close-box'
            if (this.Some) return 'mdi-minus-box'
            return 'mdi-checkbox-blank-outline'
        },
    },
    methods: {



        turn_off_signbtn() {
            this.signbtn = false;
        },

        
        turn_on_signbtn() {
            this.signbtn = true;
        },

        toggle () {
            this.$nextTick(() => {
            if (this.All) {
                this.names_selected = []
            } else {
                this.names_selected = this.names.slice()
            }
            })
        },

        login_true()
        {
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    console.log("User is signed in.")
                  console.log(user.uid);


                  console.log("// Create a reference to the cities collection");
                  dref = db.collection("cards");
                  console.log(dref);
                  console.log("// Create a query against the collection.");
                  var query = dref.where("userid", "==", user.uid);
                  query.get().then(function (querySnapshot) {
                      querySnapshot.forEach(function (doc) {
                          console.log(doc.data().familycards);
                          app.familycards = doc.data().familycards;
                          app.familycards_selected = doc.data().familycards;
                          for (i = 0; i < app.familycards.length; i++)
                          {
                            app.names.push(app.familycards[i].name);
                            app.names_selected.push(app.familycards[i].name);
                          }
                          app.login= false;
                          app.welcome = "שלום, משפחת " + doc.data().family + "!";
  
                          var enter = document.getElementById("enter");
                          enter.hidden = true;

  
                          var exit  = document.getElementById("exit");
                          exit.hidden = false;


                          app.turn_off_signbtn();
                      });
                  });

                } else {
                    app.login = true;
                }
            });

            
            var div = document.getElementById("circles");
            div.hidden = true;
            var faces_div = document.getElementById("faces");
            faces_div.hidden = true;
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


                console.log("Create a reference to the cities collection");
                var dref = db.collection("cards");

                console.log("Create a query against the collection.");
                var query = dref.where("userid", "==", cred.user.uid);
                query.get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        console.log(doc.data().familycards);
                        app.familycards = doc.data().familycards;
                        app.familycards_selected = doc.data().familycards;
                        for (i = 0; i < app.familycards.length; i++)
                        {
                          app.names.push(app.familycards[i].name);
                          app.names_selected.push(app.familycards[i].name);
                        }
                        app.login= false;
                        app.welcome = "שלום, משפחת " + doc.data().family + "!";

                        var enter = document.getElementById("enter");
                        enter.hidden = true;

                        var exit  = document.getElementById("exit");
                        exit.hidden = false;

                        app.e1 = 3;
                    });
                });
            }).then(() => {
                console.log("ok");

            }).catch(err => {
                console.log("error");
                app.reg_failed = true;
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
                document.getElementById("reg_btn").hidden = true;
                app.e1 = 2;

            }).catch(err => {
                console.log("error");
                app.reg_failed = true;
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

            app.title ='מי ראשון למקלחת?';

            setTimeout(function(){

            app.title = app.familycards_selected[0].name +"!";

            

            var div = document.getElementById("circles");
            div.hidden = true;
            var faces_div = document.getElementById("faces");
            faces_div.hidden = false;


            }, 5000);

            let array2 = [];
            this.familycards_selected = [];
            while (this.familycards.length != 0)
            {
                let randomIndex = Math.floor(Math.random() * this.familycards.length);
                array2.push(this.familycards[randomIndex]);
                this.familycards.splice(randomIndex, 1)

            }
            this.familycards = array2;
            for (i = 0; i < this.familycards.length; i++)
            {
                if (this.names_selected.includes( this.familycards[i].name))
                {
                    this.familycards_selected.push(this.familycards[i]);
                }
        
            }
            
        }
        else
        {
            app.err = true;
        }

      },

      loadImage()
      {
        console.log("loadImage");          //checks if files are selected
        this.dialog  =false;
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
                          app.loading = false;
                          app.loading_text = "";
                          app.dialog  =true;
                          app.e1 = 3;
                      })
                      .catch(function(error) {
                        console.log("error encountered");
                        app.loading_text = "error encountered";
                      });

                }
            );

        } else {
            alert("No file chosen");
        }


      },

      loadPersonImage()
      {
        console.log("loadImage"); 
        this.dialog  =false;
        this.loading = true;
        this.loading_text = "טוען קובץ תמונה..."         //checks if files are selected
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
                          app.loading = false;
                          app.loading_text = "";
                          app.dialog  =true;
                      })
                      .catch(function(error) {
                        console.log("error encountered");
                        app.loading = false;
                        app.loading_text = "";
                        app.dialog  =true;
                      });
                      app.addPersonDialog = false;
                      app.personFiles = null;
                      app.upload_failed = true;

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
          app.welcome = "שלום, משפחת " + app.family + "!"

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

            app.turn_on_signbtn();

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
        },
        isDisabled3: function(){
            return !this.stp2;
            }
    }
  });
