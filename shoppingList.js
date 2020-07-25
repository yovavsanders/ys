db.collection('buylist').get().then((snapshot)=> {
    snapshot.docs.forEach(doc => {
        console.log(doc.data().item_name);
        console.log(doc.data().date);
        var item = {
            title: doc.data().item_name,
            date_added: doc.data().date,
            done: doc.data().done,
            checked: doc.data().checked,
            data_id: doc.id
        }
        app.todos.push(item);
    });
});


db.collection('historylist').get().then((snapshot)=> {
  snapshot.docs.forEach(doc => {
      console.log(doc.data().item_name);
      app.historylist.push(doc.data().item_name);
  });
  app.historylist.sort();
});


const app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data () {
      return {
        loading: false,
        search: null,
        select: null,
        historylist: [],
        isDark:true,
        show: true,
        newTodo: '',
        todo: [],
        todos: [],
        today: new Date().getDate()+"/" + new Date().getMonth()+"/"+new Date().getFullYear(),
        day: this.todoDay(),
        date: new Date().getDate(),
        ord: this.nth(new Date().getDate()),
        year: new Date().getFullYear(),
      }
    },
    methods: {
      addTodo() {
        var value = this.newTodo && this.newTodo.trim();
        if (!value) {
          return;
        }
        this.todos.push({
          title: this.newTodo,
          done: false,
          date_added: this.today,
          checked: false
        });
        db.collection('buylist').add(
            {
                item_name: this.newTodo,
                done: false,
                date: this.today
            }
        ).then(function(docRef) {
            if (app.todos.length > 0){
                app.todos[app.todos.length - 1].data_id =  docRef.id;
            }
        });

        if (!this.historylist.includes(value))
        {
          this.historylist.push(value);
          db.collection('historylist').add(
            {
                item_name: value,
            }
          );
        }

        this.newTodo = '';
      },
      removeTodo(index) {
        db.collection('buylist').doc(this.todos[index].data_id).delete();
        this.todos.splice(index, 1); 
      },
      cbxChanged(index)
      {
        console.log(index)
        if (this.todos[index].done == true){
         db.collection('buylist').doc(this.todos[index].data_id).update({
            checked: true,
            done: true
          });
        }
        else{
          db.collection('buylist').doc(this.todos[index].data_id).update({
            checked: false,
            done: false
          });
        }
      },
      todoDay() {
        var d = new Date();
        var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        return d.getDay();
      },
      nth(d) {
        if(d>3 && d<21) return 'th';
        switch (d % 10) {
          case 1:  return "st";
          case 2:  return "nd";
          case 3:  return "rd";
          default: return "th";
        }
      },
    },
    filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
  });
