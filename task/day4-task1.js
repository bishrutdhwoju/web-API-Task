// Simulate a user database

// your application should be 6 functions to perform CRUD operations using Promise
// All function should be a Promise
// 1. createuser
// -- takes user object as argument and add to users array
// -- destructure id, name and email
// -- check if id is not present reject with error
// -- check if id is already present reject with error
// -- if name is missing, replace with "Unknown User"
// -- if email is missing, replace with "No Email"

import { read } from "node:fs";
import fs from "node:fs/promises";
import { json } from "node:stream/consumers";
const DB = "./user.json";

const readDB = async () => {
  try {
    const data = await fs.readFile(DB, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeDB = async (data) => {
  try {
    await fs.writeFile(DB, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(error);
  }
};

const createUser = async (user) => {
  try {
    const { id, name, email } = user;

    if (!id) throw new Error("id is required");

    const users = await readDB();

    if (users.find((u) => u.id === id)) {
      throw new Error("id is already present");
    }

    const newUser = {
      id,
      name: name || "Unknown User",
      email: email || "No Email",
    };

    users.push(newUser);
    await writeDB(users);
    return newUser;
  } catch (error) {
    console.log(error);
  }
};

const simulateCreateUser = async () => {
  try {
    const result = await createUser({
      id: 2,
      name: "John Doe",
      email: "john@example.com",
    });
    console.log(result);
  } catch (error) {
    console.log(error.message);
  }
};
simulateCreateUser();

// 2. returns all users after 2 seconds delay using Promise
console.time("return users after 2 sec");
var users;
new Promise(async (resolve, reject) => {
  setTimeout(async () => {
    try {
      users = await readDB();
      resolve(users);
    } catch (e) {
      reject(e);
    }
  }, 2000);
}).then((users) => {
  console.log(users);
});
console.timeEnd("return users after 2 sec");

// 3. getuserById,
// takes id as argument and returns user with that id after 1 second delay
// if not found, reject with error
const getuserById = (id) =>
  new Promise(async (resolve, reject) => {
    const users = await readDB();
    const user = users?.find((u) => u.id == id);
    if (!user) return reject("User not found");
    return resolve(user);
  });
const userById = await getuserById(2);
console.log({ userById });

// 4. searchUserByName,
// takes name as argument and returns all users that match the name
// if not found, return empty object
const searchUserByName = (name) =>
  new Promise(async (resolve, reject) => {
    const users = await readDB();
    const result = users?.filter((u) =>
      u.name?.toLowerCase().includes(name.toLowerCase()),
    );
    if (!result) return resolve([]);
    return resolve(result);
  });
const searchResult = await searchUserByName("John");
console.log({ searchResult });

// // 5. updateuser,
const updateUser = async (id, updatedUser) => {
  if (id === undefined || id === null) throw new Error("id is required");

  const { name, email } = updatedUser || {};

  const users = await readDB();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) throw new Error("User not found");

  users[index].name = name;
  users[index].email = email;

  await writeDB(users);
  return users[index];
};

// 6. deleteUser
const deleteUser = async (id) => {
  if (id === undefined || id === null) throw new Error("id is required");

  const users = await readDB();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) throw new Error("User not found");

  users.splice(index, 1);
  await writeDB(users);
  return "User deleted successfully";
};

const simulateUpdateUser = async (id, updatedUser) => {
  try {
    const result = await updateUser(id, updatedUser);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
const updatedUser = {
  name: "Jack Doe",
  email: "jack@example.com",
};
// simulateUpdateUser(1, updatedUser);

const simulateDeleteUser = async (id) => {
  try {
    const result = await deleteUser(id);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
// simulateDeleteUser(1);
