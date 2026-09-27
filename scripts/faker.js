import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker/+esm';

export default function () {
    console.log('Name: ', faker.person.fullName());
    console.log('Job Title: ', faker.person.jobTitle());
    console.log('Job Descriptor: ', faker.person.jobDescriptor());
    console.log('Job Area: ', faker.person.jobArea());
    console.log('Job Type: ', faker.person.jobType());
}