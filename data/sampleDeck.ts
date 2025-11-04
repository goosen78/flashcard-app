/**
 * Sample Flashcard Data
 * 
 * Example deck for demonstration and testing
 */

import { Deck, Card } from '@/lib/types';
import { createCard, createDeck } from '@/lib/flashcard';

// Sample cards about computer science fundamentals
const sampleCards: Card[] = [
  createCard('1', 'What is an algorithm?', 'A step-by-step procedure for solving a problem or completing a task'),
  createCard('2', 'What does O(n) mean?', 'Linear time complexity - the runtime grows proportionally with input size'),
  createCard('3', 'What is a stack?', 'A Last-In-First-Out (LIFO) data structure where elements are added and removed from the same end'),
  createCard('4', 'What is a queue?', 'A First-In-First-Out (FIFO) data structure where elements are added at one end and removed from the other'),
  createCard('5', 'What is recursion?', 'A function that calls itself to solve a problem by breaking it into smaller subproblems'),
  createCard('6', 'What is a binary tree?', 'A tree data structure where each node has at most two children (left and right)'),
  createCard('7', 'What is Big O notation?', 'A mathematical notation that describes the upper bound of an algorithm\'s time or space complexity'),
  createCard('8', 'What is a hash table?', 'A data structure that maps keys to values using a hash function for O(1) average lookup time'),
  createCard('9', 'What is polymorphism?', 'The ability of objects of different types to be accessed through the same interface'),
  createCard('10', 'What is encapsulation?', 'Bundling data and methods that operate on that data within a single unit (class)'),
];

export const sampleDeck: Deck = createDeck('Computer Science Fundamentals', sampleCards);
