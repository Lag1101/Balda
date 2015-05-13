#pragma once

#ifndef WORDTREE_H
#define WORDTREE_H

#include <vector>
#include <string>
#include <map>
#include <random>
#include <stdexcept>

#include "Node.h"

struct Word{
	std::string str;
	double weight;
	Word(const std::string & str) : str(str), weight(0.0) {}
	friend bool operator < (const Word & w1, const Word & w2) {
		return w1.weight > w2.weight;
	}
};

class WordTree{
public:
	void add(const std::string & word);
	bool exist(const std::string & word) const;
	void clear();
	void calcStats();
	size_t wordsCountWhichLengthGreaterThen(size_t size) const;
	std::string getWordByLength(size_t length, double start, double end) const;
private:
	static size_t levenshtein_distance(const std::string &s1, const std::string &s2);
private:
	Node root;
	std::vector<Word> words;
	std::map<size_t, std::vector<Word> > wordsByLength;
};

#endif