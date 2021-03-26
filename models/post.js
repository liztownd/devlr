module.exports= function(sequelize, DataTypes){
    const Post = sequelize.define("Post",{
      title:{
          type: DataTypes.STRING,
          allowNull: false,
          validate:{
            len:[1]
          }
      },
      body: {
          type: DataTypes.TEXT,
          allowNull:false,
          validate:{
           len:[1]
          }
      }
    }
   );
   Post.associate = (models) => {
    // We're saying that a Post should belong to an User
    // A Post can't be created without a User due to the foreign key constraint
    Post.belongsTo(models.Users, {
  
    onDelete:'cascade'
    });
  };
    return Post;
   };